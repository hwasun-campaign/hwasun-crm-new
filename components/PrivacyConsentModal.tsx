"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@radix-ui/react-checkbox" // Radix UI Checkbox
import { Input } from "@/components/ui/input"

export default function PrivacyConsentModal() {
  const [open, setOpen] = useState(false) // 모달 열림 여부
  const [agreed, setAgreed] = useState(false) // 동의 여부
  const [name, setName] = useState("") // 서명할 이름 입력 상태

  // 서명 입력 상태 업데이트
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  // 동의 여부 체크박스 변경 시
  const handleCheckboxChange = (checked: boolean) => {
    setAgreed(checked)
    setOpen(checked) // 동의하면 모달 열기
  }

  return (
    <div className="mt-4">
      {/* 개인정보 수집 동의 체크박스 */}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="privacy" 
          checked={agreed} 
          onCheckedChange={handleCheckboxChange} // 체크박스 상태 변경 시
        />
        <label htmlFor="privacy" className="text-sm cursor-pointer">개인정보 수집 및 이용에 동의합니다</label>
      </div>

      {/* 동의 모달 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>개인정보 수집 및 이용 동의서</DialogTitle>
          </DialogHeader>
          <div className="text-sm space-y-4 mt-4">
            <div>
              <strong>1. 개인정보 수집 목적:</strong><br />
              서비스 이용자 식별, 구성원 관리 및 통계 분석 등 CRM 운영 목적
            </div>
            <div>
              <strong>2. 수집 항목:</strong><br />
              이름, 전화번호, 소속(그룹), 등록일 등
            </div>
            <div>
              <strong>3. 보유 및 이용 기간:</strong><br />
              회원 탈퇴 시까지 또는 관련 법령에 따른 기간
            </div>
            <div>
              <strong>4. 제3자 제공 여부:</strong><br />
              없음 (단, 법령에 따른 제공 예외 있음)
            </div>
            <div>
              <strong>5. 정보주체의 권리:</strong><br />
              열람, 정정, 삭제 요청 가능. 동의 거부 시 서비스 이용 제한 가능성 있음.
            </div>

            <div className="pt-4 border-t">
              <p>위 내용을 모두 숙지하였으며, 이에 동의합니다.</p>
              <label className="block mt-2 mb-1 text-sm">서명 (이름 입력)</label>
              <Input 
                placeholder="이름을 입력하세요" 
                value={name}
                onChange={handleNameChange}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => {
                  if (name) { // 이름이 입력된 경우에만 동의 처리
                    setAgreed(true)
                    setOpen(false)
                  } else {
                    alert("서명을 입력해주세요.")
                  }
                }}
              >
                동의하고 닫기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}