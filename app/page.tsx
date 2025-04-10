'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase'; // ✅ Supabase 가져오기

type Member = {
  id: string;
  name: string;
  phone: string;
  role: string;
  birth: string;
  address: string;
  affiliation: string;
  is_member: boolean; // ✅ Supabase 컬럼에 맞춰서 이름 수정
};

export default function MiniCRM() {
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    role: '',
    birth: '',
    address: '',
    affiliation: '',
    is_member: false, // ✅ 여기도 맞춰줌
  });

  // ✅ 데이터 불러오기
  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase.from('members').select('*');
      if (error) console.error('불러오기 에러:', error);
      else setMembers(data as Member[]);
    };

    fetchMembers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // ✅ Supabase에 등록
  const addMember = async () => {
    const { name, phone, role, birth, address, affiliation } = form;
    if (!name || !phone || !role || !birth || !address || !affiliation) return;

    const { data, error } = await supabase.from('members').insert([form]);
    if (error) {
      console.error('등록 에러:', JSON.stringify(error, null, 2));
      return;
    }

    // 등록 성공 시 목록 다시 불러오기
    const { data: newData } = await supabase.from('members').select('*');
    setMembers(newData as Member[]);

    // 폼 초기화
    setForm({
      name: '',
      phone: '',
      role: '',
      birth: '',
      address: '',
      affiliation: '',
      is_member: false,
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