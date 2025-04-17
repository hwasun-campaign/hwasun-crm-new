// components/PrivacyConsentModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // ✅ 이 줄만 남김
import { Input } from "@/components/ui/input";

export default function PrivacyConsentModal() {
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // ✅ 동의 여부 체크박스 변경 시
  const handleCheckboxChange = (checked: boolean) => {
    setAgreed(checked);
    setOpen(checked); // 동의하면 모달 열기
  };

  return (
    <div className="mt-4">
      {/* 개인정보 수집 동의 체크박스 */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="privacy"
          checked={agreed}
          onCheckedChange={handleCheckboxChange}
        />
        <label htmlFor="privacy" className="text-sm cursor-pointer">
          개인정보 수집 및 이용에 동의합니다
        </label>
      </div>

      {/* 모달 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>개인정보 수집 동의</DialogTitle>
          </DialogHeader>
          <p className="text-sm mb-2">아래 내용을 확인 후 이름을 입력해주세요.</p>
          <ul className="text-xs list-disc ml-4 mb-2 space-y-1">
            <li>1. 수집 항목: 이름, 전화번호</li>
            <li>2. 이용 목적: 선거 조직 관리</li>
            <li>3. 보유 기간: 선거 종료 후 30일</li>
            <li>4. 동의 거부 시 서비스 이용 제한</li>
            <li>5. 개인정보 보호 책임자: 홍길동 (010-0000-0000)</li>
          </ul>
          <Input
            placeholder="이름을 입력하세요"
            value={name}
            onChange={handleNameChange}
          />
          <Button className="mt-4" onClick={() => setOpen(false)}>
            확인
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}