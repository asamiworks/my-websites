"use client";

type Props = {
  companyId: string;
};

const ActionButtons = ({ companyId }: Props) => {
  const handleRequestMaterials = () => {
    alert(`資料請求を送信しました (会社ID: ${companyId})`);
  };

  const handleRequestConsultation = () => {
    alert(`相談リクエストを送信しました (会社ID: ${companyId})`);
  };

  return (
    <div>
      <button onClick={handleRequestMaterials}>資料請求</button>
      <button onClick={handleRequestConsultation}>相談を希望する</button>
    </div>
  );
};

export default ActionButtons;
