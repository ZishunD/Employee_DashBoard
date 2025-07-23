import express, { Request, Response } from "express";
import multer from "multer";
import xlsx from "xlsx";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

interface Employee {
    "Employee Name": string;
    "Join Date": string;
    Role: string;
    DOB?: string;
    "ID Card"?: string;
    Remark?: string;
}

interface ReportRow {
    "Candidate Name": string;
    Role: string;
    Status: string;
    Interview: string;
    Date?: string;
}

app.post(
    "/api/analyze",
    upload.fields([
        { name: "reports", maxCount: 20 },
        { name: "employees", maxCount: 1 },
    ]),
    (req: Request, res: Response) => {
        try {
            const files = req.files as {
                [fieldname: string]: Express.Multer.File[];
            };

            if (!files || !files["employees"] || !files["reports"]) {
                return res.status(400).json({ error: "Files missing" });
            }

            // 1. read employee excel
            const empFile = files["employees"][0];
            const empWorkbook = xlsx.readFile(empFile.path);
            const empSheet = empWorkbook.Sheets[empWorkbook.SheetNames[0]];
            const employees: Employee[] = xlsx.utils.sheet_to_json(empSheet);

            // 2. choose the candidate
            const candidateMap = new Map<
                string,
                { name: string; joinDate: string; role: string; teamMember: string }
            >();

            for (const file of files["reports"]) {
                const wb = xlsx.readFile(file.path);
                const sheet = wb.Sheets[wb.SheetNames[0]];
                const rows: ReportRow[] = xlsx.utils.sheet_to_json(sheet);

                const nameParts = path.basename(file.originalname).split("_").slice(2).join(" ");
                const teamMember = nameParts.replace(/\.xls[x]?$/, "").trim();
                console.log(`Report file: ${file.originalname}, teamMember: ${teamMember}`);

                rows.forEach((row) => {
                    const status = (row.Status || "").toLowerCase();
                    const interview = (row.Interview || "").toLowerCase();
                    const candidateName = (row["Candidate Name"] || "").trim();
                    const role = (row.Role || "").trim();

                    console.log(`Row: candidate=${candidateName}, role=${role}, status=${status}, interview=${interview}`);

                    if (status === "pass" && interview === "yes") {
                        console.log(`Candidate: "${candidateName}", Role: "${role}"`);
                        const matched = employees.find(
                            (e) =>
                                e["Employee Name"].trim().toLowerCase() === candidateName.toLowerCase()
                        );

                        if (matched) {
                            console.log(`Matched employee: ${candidateName} under teamMember ${teamMember}`);
                            const key = candidateName + "__" + role;
                            if (!candidateMap.has(key)) {
                                candidateMap.set(key, {
                                    name: matched["Employee Name"],
                                    joinDate: matched["Join Date"],
                                    role: matched.Role,
                                    teamMember,
                                });
                            }
                        }
                    }

                });
            }


            // clear uploaded temp files
            [...files["reports"], empFile].forEach((f) => {
                fs.unlink(f.path, (err) => {
                    if (err) console.error("Failed to delete temp file:", err);
                });
            });

            // return results
            const results = Array.from(candidateMap.values());
            res.json(results);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Parsing failed" });
        }
    }
);

app.get("/", (req: Request, res: Response) => {
    res.send("✅ Backend is running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
