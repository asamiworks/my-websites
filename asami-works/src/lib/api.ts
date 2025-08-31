interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company: string; // オプショナルから必須に変更
  message: string;
}

interface FormData {
  name: string;
  email: string;
  tel: string;
  company: string;
  budget: string;
  deadline: string;
  inquiryType?: string;
  other?: string;
  message: string;
  token?: string;
}

// APIエンドポイント設定
const API_ENDPOINTS = {
  contact: 'https://us-central1-asamiworks-679b3.cloudfunctions.net/contact',
  form: 'https://us-central1-asamiworks-679b3.cloudfunctions.net/form',
  instagram: 'https://instagram-n4rlpzrnaq-uc.a.run.app'  // Cloud Run（変更なし）
};

export const api = {
  contact: async (data: ContactFormData) => {
    const response = await fetch(API_ENDPOINTS.contact, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || '送信に失敗しました');
    }
    
    return response.json();
  },
  
  form: async (data: FormData) => {
    const response = await fetch(API_ENDPOINTS.form, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || '送信に失敗しました');
    }
    
    return response.json();
  },
  
  instagram: {
    getPhotos: async () => {
      const response = await fetch(API_ENDPOINTS.instagram, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Instagram写真の取得に失敗しました');
      }
      
      return response.json();
    }
  }
};