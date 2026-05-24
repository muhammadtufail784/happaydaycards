import { useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import cardBg from "./assets/cardbg .png";
import schoolLogo from "./assets/logohappyday.png";
import happydaySign from "./assets/happydaypsign.png";

const CARDS_PER_PAGE = 5;

const cardPrintStyle = {
  WebkitPrintColorAdjust: "exact",
  printColorAdjust: "exact",
};

function CardShell({ children, rotated = false }) {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      position: "relative",
      border: "1px solid #333",
      borderRadius: 6,
      overflow: "hidden",
      fontSize: 14,
      transform: rotated ? "rotate(180deg)" : undefined,
      ...cardPrintStyle,
    }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${cardBg})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          ...cardPrintStyle,
        }}
      />
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

function SchoolCrest({ logo, size = 120 }) {
  return (
    <img
      src={logo || schoolLogo}
      alt=""
      style={{ height: size, width: "auto", objectFit: "contain", display: "block", margin: "0 auto" }}
    />
  );
}

function SignatureLine() {
  return (
    <img
      src={happydaySign}
      alt=""
      style={{ width: "88%", height: "auto", display: "block", margin: "1px auto 0", objectFit: "contain" }}
    />
  );
}

// Sample data

const SAMPLE = [
  { id: "S-001", name: "Junaid Ghani", fname: "Adnan Ghani", cls: "Six Red", roll: "01", expiry: "31-03-2027", issueDate: "01-04-2026", contact: "0300-1234567", address: "Lahore", photo: null },
  { id: "S-002", name: "Malik M.Yasir", fname: "Malik Abdul Ghafoor", cls: "Ten Red", roll: "02", expiry: "31-03-2026", issueDate: "01-04-2025", contact: "0316-0990588", address: "Bara Gate, Bara Road Peshawar", photo: null },
  { id: "S-003", name: "Muhammad Hammad", fname: "Habib Ur Rehman", cls: "Ten Red", roll: "03", expiry: "31-03-2026", issueDate: "01-04-2025", contact: "0336-9737998", address: "Mohala Qazi Khalalan Bazar Pesh City", photo: null },
  { id: "S-004", name: "Muhammad Ansari", fname: "Muhammad Noman", cls: "Ten Red", roll: "04", expiry: "31-03-2026", issueDate: "01-04-2025", contact: "0344-9035749", address: "Tipu Sultan Road Pesh Cantt", photo: null },
  { id: "S-005", name: "Muhammad Mujtaba", fname: "Muhammad Rizwan", cls: "Ten Red", roll: "05", expiry: "31-03-2026", issueDate: "01-04-2025", contact: "0345-9093986", address: "Outside Ramdas Bazar", photo: null },
  { id: "S-006", name: "Haris Ahmed", fname: "Ahmed Shah", cls: "Nine Blue", roll: "06", expiry: "31-03-2026", issueDate: "01-04-2025", contact: "0300-1234567", address: "Hayatabad Phase 1, Peshawar", photo: null },
  { id: "S-007", name: "Zubair Khan", fname: "Liaqat Khan", cls: "Nine Blue", roll: "07", expiry: "31-03-2026", issueDate: "01-04-2025", contact: "0311-9876543", address: "Tehkal Bala, Peshawar", photo: null },
];

// Card Front
function CardFront({ s, schoolName }) {
  return (
    <CardShell>
      <div style={{ position: "absolute", top: "3%", left: 0, right: 0, textAlign: "center", lineHeight: 1.12, padding: "0 4px" }}>
        <div style={{ fontSize: "1.05em", fontWeight: 900, color: "#111", letterSpacing: 0.4, fontFamily: "'Arial Black', Arial, sans-serif" }}>{schoolName}</div>
        <div style={{ fontSize: "0.52em", fontWeight: 800, color: "#111" }}>School System</div>
        <div style={{ fontSize: "0.45em", fontWeight: 700, color: "#111" }}>(Playgroup to Matric)</div>
        <div style={{ fontSize: "0.48em", fontWeight: 900, color: "#cc0000", letterSpacing: 0.8, marginTop: 1 }}>STUDENT CARD</div>
      </div>

      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "52%", textAlign: "center" }}>
        {s.photo ? (
          <img src={s.photo} alt={s.name} style={{ width: "100%", aspectRatio: "3/3.6", objectFit: "cover", border: "2px solid #fff", display: "block" }} />
        ) : (
          <div style={{ width: "100%", aspectRatio: "3/3.6", background: "#c8d8e8", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2em", color: "#666" }}>👤</div>
        )}
        <SignatureLine />
      </div>

      <div style={{ position: "absolute", top: "62%", left: 0, right: 0, textAlign: "center", fontSize: "0.42em", fontWeight: 700, color: "#cc0000", fontStyle: "italic" }}>
        Issuing Authority
      </div>

      <div style={{ position: "absolute", bottom: "4%", left: "8%", right: "6%", fontSize: "0.46em", fontWeight: 700, color: "#111", lineHeight: 1.55, fontFamily: "Arial, sans-serif" }}>
        <div><b>Name:</b>&nbsp;&nbsp;{s.name}</div>
        <div><b>F/Name:</b>&nbsp;{s.fname}</div>
        <div><b>Class:</b>&nbsp;&nbsp;&nbsp;{s.cls}</div>
      </div>
    </CardShell>
  );
}
// Card Back
function CardBack({ s, schoolName, phone, address: schoolAddr, expiry: defaultExpiry, issue: defaultIssue, logo }) {
  const exp = s.expiry || defaultExpiry;
  const iss = s.issueDate || defaultIssue;

  return (
    <CardShell>
      <div style={{ position: "absolute", top: "3%", left: 0, right: 0, textAlign: "center", lineHeight: 1.12, padding: "0 4px" }}>
        <div style={{ fontSize: "1.05em", fontWeight: 900, color: "#111", letterSpacing: 0.4, fontFamily: "'Arial Black', Arial, sans-serif" }}>{schoolName}</div>
        <div style={{ fontSize: "0.52em", fontWeight: 800, color: "#111" }}>School System</div>
        <div style={{ fontSize: "0.45em", fontWeight: 700, color: "#111" }}>(Playgroup to Matric)</div>
      </div>

      <div style={{ position: "absolute", top: "24%", left: 0, right: 0, textAlign: "center", padding: "0 8px", fontSize: "0.44em", fontWeight: 700, color: "#111", lineHeight: 1.45 }}>
        <div><b>Contact:</b> {s.contact || "—"}</div>
        <div><b>Address:</b> {s.address || "—"}</div>
      </div>

      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}>
        <SchoolCrest logo={logo} />
      </div>

      <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0 }}>
        <div style={{ background: "#111", color: "#FFD700", textAlign: "center", padding: "3px 4px", fontSize: "0.42em", fontWeight: 700, lineHeight: 1.4 }}>
          <div>{schoolAddr}</div>
          <div>Ph. {phone}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 8px 0", fontSize: "0.42em", fontWeight: 700, color: "#cc0000" }}>
          <span>Issue: {iss}</span>
          <span>Expiry: {exp}</span>
        </div>
      </div>
    </CardShell>
  );
}

function RotatedCardSlot({ children, slotW, slotH }) {
  return (
    <div style={{
      width: slotW,
      height: slotH,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}>
      <div style={{ width: slotH, height: slotW, transform: "rotate(-90deg)" }}>
        {children}
      </div>
    </div>
  );
}

function A4Page({ students, pageNum, cfg }) {
  const slotW = "96mm";
  const slotH = "55mm";

  const emptySlot = (
    <div style={{ width: slotW, height: slotH, border: "1.5px dashed #ccc", borderRadius: 4, flexShrink: 0 }} />
  );

  return (
    <div className="a4-page" style={{
      width: "210mm", minHeight: "297mm",
      background: "#fff",
      padding: "6mm 5mm",
      display: "flex", flexDirection: "row", gap: "2mm",
      boxSizing: "border-box",
      pageBreakAfter: "always",
      position: "relative",
      ...cardPrintStyle,
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "2mm", flex: 1 }}>
        {students.map((s, i) => (
          <RotatedCardSlot key={"b" + i} slotW={slotW} slotH={slotH}>
            <CardBack s={s} {...cfg} />
          </RotatedCardSlot>
        ))}
        {Array.from({ length: CARDS_PER_PAGE - students.length }).map((_, i) => (
          <div key={"be" + i}>{emptySlot}</div>
        ))}
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 10,
        flexShrink: 0,
        color: "#aaa",
        fontSize: 8,
        gap: 4,
      }}>
        <div style={{ flex: 1, borderLeft: "1px dashed #bbb", width: 0 }} />
        <span style={{ writingMode: "vertical-rl", textOrientation: "mixed", letterSpacing: 1 }}>✂ cut here</span>
        <div style={{ flex: 1, borderLeft: "1px dashed #bbb", width: 0 }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2mm", flex: 1 }}>
        {students.map((s, i) => (
          <RotatedCardSlot key={"f" + i} slotW={slotW} slotH={slotH}>
            <CardFront s={s} schoolName={cfg.schoolName} />
          </RotatedCardSlot>
        ))}
        {Array.from({ length: CARDS_PER_PAGE - students.length }).map((_, i) => (
          <div key={"fe" + i}>{emptySlot}</div>
        ))}
      </div>

      <div style={{
        position: "absolute",
        bottom: "4mm",
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 7.5,
        color: "#bbb",
      }}>
        Page {pageNum}
      </div>
    </div>
  );
}

function normalizeKey(key) {
  return String(key).trim().toLowerCase().replace(/\s+/g, " ");
}

function col(row, keys) {
  const normalized = Object.fromEntries(
    Object.entries(row).map(([k, v]) => [normalizeKey(k), v])
  );
  for (const key of keys) {
    const val = normalized[normalizeKey(key)];
    if (val !== "" && val != null) return val;
  }
  return "";
}

function formatDate(value) {
  if (value === "" || value == null) return "";
  if (value instanceof Date) {
    const d = value.getDate().toString().padStart(2, "0");
    const m = (value.getMonth() + 1).toString().padStart(2, "0");
    return `${d}-${m}-${value.getFullYear()}`;
  }
  if (typeof value === "number") {
    const date = new Date(Math.round((value - 25569) * 86400 * 1000));
    if (!Number.isNaN(date.getTime())) {
      const d = date.getDate().toString().padStart(2, "0");
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      return `${d}-${m}-${date.getFullYear()}`;
    }
  }
  return String(value);
}

function parseRowsFromFile(content) {
  const wb = XLSX.read(content, { type: "string", cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws, { defval: "" });
}

function parseStudentRow(row, idx) {
  const rawExpiry = col(row, ["Expiry Date", "ExpiryDate", "Expiry"]);
  const rawIssue = col(row, ["Issue Date", "IssueDate", "Issue"]);
  const rawClass = col(row, ["Class", "Grade", "CLASS"]);

  return {
    id: col(row, ["ID", "Student ID", "StudentID"]) || `S-${String(idx + 1).padStart(3, "0")}`,
    name: col(row, ["Name", "Student Name", "StudentName"]),
    fname: col(row, ["Father Name", "Father", "FatherName", "F/Name", "FATHER"]),
    cls: rawClass,
    roll: String(col(row, ["Roll", "Roll No", "RollNo", "ROLL"])),
    contact: String(col(row, ["Contact", "Phone", "Mobile", "Tel"])),
    address: col(row, ["Address", "Home Address"]),
    expiry: formatDate(rawExpiry) || col(row, ["Expiry Date", "ExpiryDate", "Expiry"]),
    issueDate: formatDate(rawIssue) || col(row, ["Issue Date", "IssueDate", "Issue"]),
    photo: col(row, ["Picture", "Photo", "Image"]) || null,
  };
}

export default function App() {
  const [students, setStudents] = useState([]);
  const [step, setStep] = useState("upload");
  const [error, setError] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [cfg, setCfg] = useState({
    schoolName: "HAPPYDAY",
    tagline: "Playgroup to Matric",
    phone: "091-5273963 & 65",
    address: "2-Islamia Road, Peshawar Cantt",
    expiry: "31-03-2026",
    issue: "01-04-2025",
    logo: null,
  });

  const fileRef = useRef();
  const logoRef = useRef();

  const classes = ["All", ...Array.from(new Set(students.map((s) => s.cls).filter(Boolean))).sort()];
  const visible = filterClass === "All" ? students : students.filter((s) => s.cls === filterClass);
  const pages = Array.from({ length: Math.ceil(visible.length / CARDS_PER_PAGE) }, (_, i) =>
    visible.slice(i * CARDS_PER_PAGE, (i + 1) * CARDS_PER_PAGE)
  );

  const handleLogo = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setCfg((c) => ({ ...c, logo: ev.target.result })); };
    reader.readAsDataURL(f);
  };

  const handleFile = useCallback((e) => {
    setError("");
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const rows = parseRowsFromFile(ev.target.result);
        if (!rows.length) { setError("CSV file appears empty."); return; }

        const parsed = rows.map((row, idx) => parseStudentRow(row, idx)).filter((s) => s.name);

        if (!parsed.length) {
          setError("Could not read names. Check column headers (Name, Father Name, Class/Grade, Contact, Address, Expiry Date, Picture).");
          return;
        }
        setStudents(parsed);
        setStep("preview");
      } catch {
        setError("Failed to read file. Please upload a valid .csv file.");
      }
    };

    reader.readAsText(file);
    if (e.target?.value !== undefined) e.target.value = "";
  }, []);

  const printStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Noto+Sans:wght@400;600;700&display=swap');
    * { box-sizing: border-box; }
    @media print {
      .no-print { display: none !important; }
      body { background: #fff !important; margin: 0; padding: 0; }
      .print-wrap { background: #fff !important; padding: 0 !important; }
      .a4-page { box-shadow: none !important; margin: 0 !important; break-after: page; }
    }
    input:focus { outline: 2px solid #FFD700; }
  `;

  if (step === "upload") return (
    <div style={{ minHeight: "100vh", background: "#1a1a1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Arial, sans-serif" }}>
      <style>{printStyles}</style>

      <div style={{ maxWidth: 560, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-block", background: "#FFD700", color: "#111", fontFamily: "'Black Han Sans', sans-serif", fontSize: 36, padding: "6px 24px", letterSpacing: 2, borderRadius: 4, marginBottom: 8 }}>HAPPYDAY</div>
          <div style={{ color: "#aaa", fontSize: 13 }}>Student Card Printer · 5 cards per column (back | front) per A4 page</div>
        </div>

        <div style={{ background: "#2a2a2a", borderRadius: 10, padding: 20, marginBottom: 18 }}>
          <div style={{ color: "#FFD700", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>SCHOOL SETTINGS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              ["School Name", "schoolName"],
              ["Tagline", "tagline"],
              ["Phone", "phone"],
              ["Address", "address"],
              ["Default Issue", "issue"],
              ["Default Expiry", "expiry"],
            ].map(([label, key]) => (
              <div key={key} style={{ gridColumn: key === "address" ? "1 / -1" : "auto" }}>
                <label style={{ fontSize: 10, color: "#888", display: "block", marginBottom: 3 }}>{label.toUpperCase()}</label>
                <input value={cfg[key] || ""} onChange={(e) => setCfg((c) => ({ ...c, [key]: e.target.value }))} style={{ width: "100%", background: "#333", border: "1px solid #444", color: "#fff", borderRadius: 5, padding: "7px 10px", fontSize: 12 }} />
              </div>
            ))}
        <div>
              <label style={{ fontSize: 10, color: "#888", display: "block", marginBottom: 3 }}>SCHOOL LOGO (optional)</label>
              <button type="button" onClick={() => logoRef.current.click()} style={{ background: "#333", border: "1px solid #444", color: "#ccc", borderRadius: 5, padding: "7px 14px", fontSize: 12, cursor: "pointer", width: "100%" }}>{cfg.logo ? "✅ Logo loaded" : "📁 Upload logo PNG"}</button>
              <input ref={logoRef} type="file" accept="image/*" onChange={handleLogo} style={{ display: "none" }} />
            </div>
          </div>
        </div>

        <div onClick={() => fileRef.current.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFile(e); }} style={{ border: "2px dashed #FFD700", borderRadius: 10, padding: "32px 24px", cursor: "pointer", background: "rgba(255,215,0,.04)", textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 34, marginBottom: 8 }}>📂</div>
          <div style={{ color: "#FFD700", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Click or drag & drop CSV file</div>
          <div style={{ color: "#777", fontSize: 12 }}>.csv — Name, Father Name, Class/Grade, Contact, Address, Picture, Issue Date, Expiry Date</div>
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFile} style={{ display: "none" }} />
        </div>

        {error && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 10, textAlign: "center" }}>⚠️ {error}</div>}

        <button type="button" onClick={() => { setStudents(SAMPLE); setStep("preview"); }} style={{ width: "100%", background: "#333", border: "1.5px solid #555", color: "#ddd", borderRadius: 8, padding: 11, fontSize: 13, cursor: "pointer" }}>Try with 7 sample students →</button>

        <div style={{ marginTop: 16, background: "#2a2a2a", borderRadius: 8, padding: 14 }}>
          <div style={{ color: "#666", fontSize: 10, letterSpacing: 0.5, marginBottom: 6 }}>EXPECTED CSV COLUMNS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["Name", "Father Name", "Class", "Grade", "Contact", "Address", "Picture", "Issue Date", "Expiry Date", "ID"].map((c) => (
              <span key={c} style={{ background: "#333", color: "#FFD700", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontFamily: "monospace" }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#111", fontFamily: "Arial, sans-serif" }}>
      <style>{printStyles}</style>

      <div className="no-print" style={{ background: "#FFD700", padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,.4)" }}>
        <button type="button" onClick={() => setStep("upload")} style={{ background: "#111", color: "#FFD700", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>← Back</button>
        <div style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: 20, color: "#111", letterSpacing: 1 }}>HAPPYDAY Printer</div>
        <div style={{ fontSize: 12, color: "#333" }}>{students.length} students · {pages.length} pages · Double-Sided</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginLeft: 8 }}>
          {classes.map((c) => (
            <button key={c} type="button" onClick={() => setFilterClass(c)} style={{ background: filterClass === c ? "#111" : "rgba(0,0,0,.1)", color: filterClass === c ? "#FFD700" : "#111", border: "1.5px solid #111", borderRadius: 5, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>{c}</button>
          ))}
        </div>
        <button type="button" onClick={() => window.print()} style={{ background: "#111", color: "#FFD700", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 900, fontSize: 13, cursor: "pointer", letterSpacing: 0.5, marginLeft: "auto" }}>🖨 Print ({pages.length} pages)</button>
      </div>

      <div className="no-print" style={{ background: "#1e1e1e", borderBottom: "1px solid #333", padding: "8px 20px", display: "flex", gap: 24, flexWrap: "wrap" }}>
        {[["Total", students.length], ["Showing", visible.length], ["Pages", pages.length], ["Layout", "Back | Front columns"]].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 0.4 }}>{k}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#FFD700" }}>{v}</div>
          </div>
        ))}
      </div>

      <div className="print-wrap" style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, background: "#111" }}>
        {pages.length === 0 ? (
          <div style={{ color: "#555", marginTop: 60, fontSize: 15 }}>No students to display.</div>
        ) : pages.map((pg, pi) => (
          <div key={pi} style={{ boxShadow: "0 6px 30px rgba(0,0,0,.6)" }}>
            <A4Page students={pg} pageNum={pi + 1} cfg={cfg} />
          </div>
        ))}
      </div>
    </div>
  );
}
