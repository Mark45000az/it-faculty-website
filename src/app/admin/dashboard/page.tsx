"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";

interface Application {
  id: number;
  national_id: string;
  prefix: string;
  full_name: string;
  school: string;
  province: string;
  program: string;
  round: string;
  phone: string;
  email: string;
  status: string;
  created_at: string;
}

const programMap: Record<string, string> = {
  it: "เทคโนโลยีสารสนเทศ",
  cs: "วิทยาการคอมพิวเตอร์",
  msi: "วิทยาการมัลติมีเดียฯ",
};

const roundMap: Record<string, string> = {
  portfolio: "รอบ 1 Portfolio",
  quota: "รอบ 2 Quota",
  admission: "รอบ 3 Admission",
};

const statusMap: Record<string, string> = {
  pending: "รอดำเนินการ",
  approved: "อนุมัติ",
  rejected: "ไม่อนุมัติ",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProgram, setFilterProgram] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchApplications = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterProgram !== "all") params.set("program", filterProgram);
      if (searchQuery) params.set("search", searchQuery);

      const response = await fetch(`/api/applications?${params.toString()}`);
      const result = await response.json();

      if (response.ok) {
        setApplications(result.applications || []);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, filterProgram, searchQuery]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchApplications();
  }, [fetchApplications, router]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setApplications(prev =>
          prev.map(app =>
            app.id === id ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ต้องการลบใบสมัครนี้หรือไม่?")) return;

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setApplications(prev => prev.filter(app => app.id !== id));
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch("/api/applications/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applications_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  // Stats
  const totalCount = applications.length;
  const pendingCount = applications.filter(a => a.status === "pending").length;
  const approvedCount = applications.filter(a => a.status === "approved").length;
  const rejectedCount = applications.filter(a => a.status === "rejected").length;

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <img src="/images/ITLogo.png" alt="Logo" className={styles.sidebarLogo} />
          <h2>Admin Panel</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <a className={`${styles.navItem} ${styles.active}`}>📊 Dashboard</a>
          <a className={styles.navItem} onClick={handleExportCSV}>📥 ส่งออก CSV</a>
        </nav>
        <button onClick={handleLogout} className={styles.logoutButton}>
          🚪 ออกจากระบบ
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <h1>จัดการใบสมัครนักศึกษา</h1>
          <span className={styles.adminBadge}>👤 Admin</span>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statTotal}`}>
            <div className={styles.statNumber}>{totalCount}</div>
            <div className={styles.statLabel}>ทั้งหมด</div>
          </div>
          <div className={`${styles.statCard} ${styles.statPending}`}>
            <div className={styles.statNumber}>{pendingCount}</div>
            <div className={styles.statLabel}>รอดำเนินการ</div>
          </div>
          <div className={`${styles.statCard} ${styles.statApproved}`}>
            <div className={styles.statNumber}>{approvedCount}</div>
            <div className={styles.statLabel}>อนุมัติแล้ว</div>
          </div>
          <div className={`${styles.statCard} ${styles.statRejected}`}>
            <div className={styles.statNumber}>{rejectedCount}</div>
            <div className={styles.statLabel}>ไม่อนุมัติ</div>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filterBar}>
          <input
            type="text"
            placeholder="🔍 ค้นหาชื่อหรือเลขบัตรประชาชน..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="pending">รอดำเนินการ</option>
            <option value="approved">อนุมัติ</option>
            <option value="rejected">ไม่อนุมัติ</option>
          </select>
          <select
            className={styles.filterSelect}
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
          >
            <option value="all">สาขาทั้งหมด</option>
            <option value="it">เทคโนโลยีสารสนเทศ</option>
            <option value="cs">วิทยาการคอมพิวเตอร์</option>
            <option value="msi">มัลติมีเดียปัญญาประดิษฐ์</option>
          </select>
          <button className={styles.searchButton} onClick={fetchApplications}>
            ค้นหา
          </button>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          {isLoading ? (
            <div className={styles.loading}>กำลังโหลดข้อมูล...</div>
          ) : applications.length === 0 ? (
            <div className={styles.empty}>ไม่พบข้อมูลผู้สมัคร</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>บัตรประชาชน</th>
                  <th>สาขา</th>
                  <th>รอบ</th>
                  <th>เบอร์โทร</th>
                  <th>สถานะ</th>
                  <th>วันที่สมัคร</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr key={app.id}>
                    <td>{index + 1}</td>
                    <td className={styles.nameCell}>
                      {app.prefix}{app.full_name}
                    </td>
                    <td className={styles.monoCell}>{app.national_id}</td>
                    <td>{programMap[app.program] || app.program}</td>
                    <td>{roundMap[app.round] || app.round}</td>
                    <td className={styles.monoCell}>{app.phone}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[`status_${app.status}`]}`}>
                        {statusMap[app.status] || app.status}
                      </span>
                    </td>
                    <td>{new Date(app.created_at).toLocaleDateString("th-TH")}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        {app.status !== "approved" && (
                          <button
                            className={styles.approveBtn}
                            onClick={() => handleStatusChange(app.id, "approved")}
                            title="อนุมัติ"
                          >
                            ✅
                          </button>
                        )}
                        {app.status !== "rejected" && (
                          <button
                            className={styles.rejectBtn}
                            onClick={() => handleStatusChange(app.id, "rejected")}
                            title="ไม่อนุมัติ"
                          >
                            ❌
                          </button>
                        )}
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(app.id)}
                          title="ลบ"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
