'use client'

import React, { useState } from "react";

interface StepOneProps {
  onNext: (data: Record<string, string>) => void;
}

const StepOne: React.FC<StepOneProps> = ({ onNext }) => {
  const [data, setData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-start gap-2">
        <label>Project Name</label>
        <input className="border border-green-50 rounded-lg p-2" type="text" name="projectName" onChange={handleChange} />
      </div>
      <button type="submit">Next</button>
    </form>
  );
};

export default StepOne;
