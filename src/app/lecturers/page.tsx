"use client";

import { useState, useMemo } from "react";
import { lecturers } from "@/data/lecturers";
import LecturerCard from "@/components/lecturers/LecturerCard";
import styles from "./page.module.css";

export default function LecturersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("all");

  const filteredLecturers = useMemo(() => {
    return lecturers.filter((lecturer) => {
      // Filter by program
      if (selectedProgram !== "all" && lecturer.program !== selectedProgram) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.trim().toLocaleLowerCase('th');
        const haystack = [
          lecturer.name,
          lecturer.position,
          lecturer.academicTitle,
          lecturer.program,
          ...lecturer.specialties,
          ...lecturer.courses,
        ].filter(Boolean).join(' ').toLocaleLowerCase('th');
        
        if (!haystack.includes(query)) {
          return false;
        }
      }
      
      return true;
    });
  }, [searchQuery, selectedProgram]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>รายนามอาจารย์</h1>
        <p className={styles.subtitle}>คณะเทคโนโลยีสารสนเทศ มหาวิทยาลัยราชภัฏร้อยเอ็ด</p>
      </div>
      
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="ค้นหาชื่อ, ตำแหน่ง, สาขา, ความเชี่ยวชาญ..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterBox}>
          <select 
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">ทุกสาขาวิชา</option>
            <option value="เทคโนโลยีสารสนเทศ">เทคโนโลยีสารสนเทศ</option>
            <option value="วิทยาการคอมพิวเตอร์">วิทยาการคอมพิวเตอร์</option>
            <option value="วิทยาการมัลติมีเดียปัญญาประดิษฐ์">วิทยาการมัลติมีเดียปัญญาประดิษฐ์ (MSI)</option>
          </select>
        </div>
      </div>
      
      {filteredLecturers.length > 0 ? (
        <div className={styles.grid}>
          {filteredLecturers.map((lecturer) => (
            <LecturerCard key={lecturer.id} lecturer={lecturer} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>ไม่พบข้อมูลอาจารย์ที่ตรงกับเงื่อนไข</h3>
          <p>ลองเปลี่ยนคำค้นหาหรือยกเลิกตัวกรองบางรายการ</p>
          <button 
            onClick={() => { setSearchQuery(""); setSelectedProgram("all"); }}
            className={styles.resetBtn}
          >
            ล้างการค้นหา
          </button>
        </div>
      )}
    </div>
  );
}
