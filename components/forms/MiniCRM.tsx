// components/forms/MiniCRM.tsx
'use client';

import { useState } from 'react';

export const MiniCRM = () => {  // default export 대신 named export 사용
  const [address, setAddress] = useState('화순군');

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  return (
    <form>
      <div>
        <label htmlFor="address">주소</label>
        <input
          type="text"
          id="address"
          name="address"
          value={address}
          onChange={handleAddressChange}
        />
      </div>
      {/* 다른 폼 필드들 */}
    </form>
  );
};