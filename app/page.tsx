'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';

export default function MiniCRM() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', role: '', birth: '', address: '', affiliation: '', isMember: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const addMember = () => {
    if (!form.name || !form.phone || !form.role || !form.birth || !form.address || !form.affiliation) return;
    setMembers([...members, { ...form }]);
    setForm({ name: '', phone: '', role: '', birth: '', address: '', affiliation: '', isMember: false });
  };

  const affiliationStats = useMemo(() => {
    const stats = {};
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
            <Checkbox name="isMember" checked={form.isMember} onChange={handleChange} />
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
        {members.map((member, idx) => (
          <motion.div
            key={idx}
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
            <p><strong>권리당원:</strong> {member.isMember ? '✅ 예' : '❌ 아니오'}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
