// components/forms/MiniCRM.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';

// 타입 정의
type Group = {
  id: string;
  name: string;
};

type Member = {
  id: string;
  name: string;
  phone: string;
  role: string;
  birth: string;
  address: string;
  group_id: string;
  is_member: boolean;
};

export default function MiniCRM() {
  const [members, setMembers] = useState<Member[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    role: '',
    birth: '',
    address: '',
    group_id: '',
    is_member: false,
  });

  // 🔢 전화번호 자동 하이픈 처리
  const formatPhone = (value: string) => {
    const onlyNums = value.replace(/[^0-9]/g, '');
    if (onlyNums.length <= 3) return onlyNums;
    if (onlyNums.length <= 7) return onlyNums.replace(/(\d{3})(\d{1,4})/, '$1-$2');
    return onlyNums.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
  };
  // 🆕 생년월일(주민번호 앞자리) 하이픈 처리 함수
  const formatBirth = (value: string) => {
    const onlyNums = value.replace(/[^0-9]/g, '');
    if (onlyNums.length <= 6) return onlyNums;
    return onlyNums.replace(/(\d{6})(\d{1,7})/, '$1-$2');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
  
    const newValue =
      name === 'phone' ? formatPhone(value)
      : name === 'birth' ? formatBirth(value)
      : value;
  
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : newValue,
    });
  };

  const addMember = async () => {
    const { name, phone, role, birth, address, group_id } = form;
    if (!name || !phone || !role || !birth || !address || !group_id) return;

    const fullAddress = `화순군 ${address}`;

    const { error } = await supabase.from('members').insert([
      { ...form, address: fullAddress },
    ]);
    if (error) {
      console.error('등록 에러:', error);
      return;
    }

    const { data: newData } = await supabase.from('members').select('*');
    if (newData) setMembers(newData as Member[]);

    setForm({
      name: '',
      phone: '',
      role: '',
      birth: '',
      address: '',
      group_id: '',
      is_member: false,
    });
  };

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const { data: memberData } = await supabase.from('members').select('*');
      const { data: groupData } = await supabase.from('groups').select('*');
      if (memberData) setMembers(memberData as Member[]);
      if (groupData) setGroups(groupData as Group[]);
    };
    fetchData();
  }, []);

  const groupStats = useMemo(() => {
    const stats: Record<string, number> = {};
    members.forEach((m) => {
      const group = groups.find((g) => g.id === m.group_id);
      const groupName = group?.name ?? '(알 수 없음)';
      stats[groupName] = (stats[groupName] || 0) + 1;
    });
    return stats;
  }, [members, groups]);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">선거 조직용 미니 CRM</h1>

      <Card>
        <CardContent className="space-y-4 p-4">
          <Input name="name" placeholder="이름" value={form.name} onChange={handleChange} />
          <Input name="phone" placeholder="연락처 (예: 010-1234-5678)" value={form.phone} onChange={handleChange} />
          <Input name="role" placeholder="역할 (예: 동책임자)" value={form.role} onChange={handleChange} />
          <Input name="birth" placeholder="생년월일 (예: 830515-2)" value={form.birth} onChange={handleChange} />

          {/* 주소 입력 (화순군 고정, 나머지 입력 가능) */}
          <div className="flex items-center border rounded px-2 py-1">
            <span className="whitespace-nowrap text-gray-500">화순군</span>
            <input
              type="text"
              name="address"
              placeholder="화순읍 중앙로 1"
              value={form.address}
              onChange={handleChange}
              className="flex-1 outline-none px-2"
            />
          </div>

          <label className="flex items-center space-x-2">
            <Checkbox name="is_member" checked={form.is_member} onChange={handleChange} />
            <span>권리당원 여부</span>
          </label>

          <Button onClick={addMember}>등록</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-4">
          <h2 className="text-lg font-semibold">소속별 인원 통계</h2>
          {Object.entries(groupStats).map(([group, count]) => (
            <p key={group}><strong>{group}:</strong> {count}명</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}