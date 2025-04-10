'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

type Member = {
  id: string;
  name: string;
  phone: string;
  role: string;
  birth: string;
  address: string;
  affiliation: string;
  is_member: boolean;
  group_id: string;
};

type Group = {
  id: string;
  name: string;
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
    affiliation: '',
    is_member: false,
    group_id: '',
  });

  // ✅ 조직원, 그룹 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const { data: memberData, error: memberError } = await supabase.from('members').select('*');
      if (memberError) console.error('멤버 불러오기 에러:', memberError);
      else setMembers(memberData as Member[]);

      const { data: groupData, error: groupError } = await supabase.from('groups').select('*');
      if (groupError) console.error('그룹 불러오기 에러:', groupError);
      else setGroups(groupData as Group[]);
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const addMember = async () => {
    const { name, phone, role, birth, address, affiliation, group_id } = form;
    if (!name || !phone || !role || !birth || !address || !affiliation || !group_id) {
      alert('모든 항목을 입력해 주세요!');
      return;
    }

    const { error } = await supabase.from('members').insert([form]);
    if (error) {
      console.error('등록 에러:', JSON.stringify(error, null, 2));
      return;
    }

    const { data: newData } = await supabase.from('members').select('*');
    setMembers(newData as Member[]);

    setForm({
      name: '',
      phone: '',
      role: '',
      birth: '',
      address: '',
      affiliation: '',
      is_member: false,
      group_id: '',
    });
  };

  const affiliationStats = useMemo(() => {
    const stats: Record<string, number> = {};
    members.forEach((m) => {
      const key = m.affiliation;
      stats[key] = stats[key] ? stats[key] + 1 : 1;
    });
    return stats;
  }, [members]);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">선거 조직용 미니 CRM</h1>

      <Card>
        <CardContent className="space-y-4 p-4">
          <Input name="name" placeholder="이름" value={form.name} onChange={handleChange} />
          <Input name="phone" placeholder="연락처" value={form.phone} onChange={handleChange} />
          <Input name="role" placeholder="역할 (예: 동책임자)" value={form.role} onChange={handleChange} />
          <Input name="birth" placeholder="생년월일 (예: 830515-2)" value={form.birth} onChange={handleChange} />
          <Input name="address" placeholder="주소 (예: 화순군 화순읍 ...)" value={form.address} onChange={handleChange} />
          <Input name="affiliation" placeholder="소속 (예: A조직, B조직 등)" value={form.affiliation} onChange={handleChange} />

          {/* ✅ 그룹 선택 드롭다운 */}
          <select
            name="group_id"
            value={form.group_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">그룹 선택</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

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
          {Object.entries(affiliationStats).map(([key, count]) => (
            <p key={key}><strong>{key}:</strong> {count}명</p>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {members.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-xl p-4 shadow-sm"
          >
            <p><strong>이름:</strong> {member.name}</p>
            <p><strong>연락처:</strong> {member.phone}</p>
            <p><strong>역할:</strong> {member.role}</p>
            <p><strong>생년월일:</strong> {member.birth}</p>
            <p><strong>주소:</strong> {member.address}</p>
            <p><strong>소속:</strong> {member.affiliation}</p>
            <p><strong>권리당원:</strong> {member.is_member ? '✅ 예' : '❌ 아니오'}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}