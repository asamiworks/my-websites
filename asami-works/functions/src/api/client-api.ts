// Client Management API endpoints for Firebase Functions
// Implements CRUD operations with comprehensive validation and error handling

import * as functions from 'firebase-functions';
const cors = require('cors');
import { firebaseAdminService, Client } from '../services/firebase-admin-service';

// CORS configuration
const corsHandler = cors({
  origin: [
    'https://asami-works.com',
    'https://asamiworks-679b3.web.app',
    'https://asamiworks-679b3.firebaseapp.com',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Helper function to check authentication
const checkAuthentication = (req: any): { isAuthenticated: boolean; uid?: string; error?: string } => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isAuthenticated: false, error: '認証が必要です。' };
  }

  // TODO: Implement proper JWT token verification
  // For now, we'll simulate authentication
  const token = authHeader.substring(7);

  if (!token) {
    return { isAuthenticated: false, error: '無効な認証トークンです。' };
  }

  // Temporary authentication check - replace with actual JWT verification
  return { isAuthenticated: true, uid: 'admin' };
};

// Security headers
const addSecurityHeaders = (res: any) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
};

// Input validation
const validateClientData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.clientName || typeof data.clientName !== 'string' || data.clientName.trim().length < 2) {
    errors.push('クライアント名は2文字以上で入力してください。');
  }

  if (!data.siteName || typeof data.siteName !== 'string' || data.siteName.trim().length < 2) {
    errors.push('サイト名は2文字以上で入力してください。');
  }

  if (!data.postalCode || !/^\d{3}-\d{4}$/.test(data.postalCode.trim())) {
    errors.push('郵便番号はXXX-XXXX形式で入力してください。');
  }

  if (!data.address1 || typeof data.address1 !== 'string' || data.address1.trim().length === 0) {
    errors.push('住所1は必須です。');
  }

  if (!data.billingFrequency || !['monthly', 'yearly'].includes(data.billingFrequency)) {
    errors.push('請求サイクルは月次または年次を選択してください。');
  }

  if (!data.managementFee || typeof data.managementFee !== 'number' || data.managementFee <= 0) {
    errors.push('管理費は0より大きい数値を入力してください。');
  }

  if (!data.managementStartDate || isNaN(new Date(data.managementStartDate).getTime())) {
    errors.push('管理開始日を正しい形式で入力してください。');
  }

  if (!data.contractStartDate || isNaN(new Date(data.contractStartDate).getTime())) {
    errors.push('契約開始日を正しい形式で入力してください。');
  }

  // Validate date order
  if (data.contractEndDate && data.contractStartDate) {
    const startDate = new Date(data.contractStartDate);
    const endDate = new Date(data.contractEndDate);
    if (startDate >= endDate) {
      errors.push('契約終了日は開始日より後の日付を設定してください。');
    }
  }

  // Validate fee change date
  if (data.feeChangeDate && data.managementStartDate) {
    const managementStart = new Date(data.managementStartDate);
    const feeChange = new Date(data.feeChangeDate);
    if (feeChange <= managementStart) {
      errors.push('料金変更日は管理開始日より後の日付を設定してください。');
    }
  }

  // If fee change date is set, new management fee is required
  if (data.feeChangeDate && (!data.newManagementFee || data.newManagementFee <= 0)) {
    errors.push('料金変更日が設定されている場合、新管理費は必須です。');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ====================================
// Client API Handler
// ====================================

export const clientApi = functions.https.onRequest((request, response) => {
  addSecurityHeaders(response);

  corsHandler(request, response, async () => {
    // Handle OPTIONS request
    if (request.method === 'OPTIONS') {
      response.status(200).send();
      return;
    }

    try {
      // Check authentication
      const authResult = checkAuthentication(request);
      if (!authResult.isAuthenticated) {
        response.status(401).json({
          success: false,
          message: authResult.error
        });
        return;
      }

      // Route based on HTTP method and path
      const path = request.path;
      const method = request.method;

      console.log(`Client API: ${method} ${path}`);

      switch (method) {
        case 'GET':
          await handleGetClients(request, response);
          break;

        case 'POST':
          await handleCreateClient(request, response);
          break;

        case 'PUT':
          await handleUpdateClient(request, response, path);
          break;

        case 'DELETE':
          await handleDeleteClient(request, response, path);
          break;

        default:
          response.status(405).json({
            success: false,
            message: 'メソッドが許可されていません。'
          });
      }

    } catch (error) {
      console.error('Client API error:', error);
      response.status(500).json({
        success: false,
        message: 'サーバーエラーが発生しました。'
      });
    }
  });
});

// ====================================
// Handler Functions
// ====================================

// GET /api/clients - List clients with filtering
async function handleGetClients(req: any, res: any) {
  try {
    const { isActive, billingFrequency, search, sortBy, sortOrder, limit } = req.query;

    const filters: any = {};

    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }

    if (billingFrequency) {
      filters.billingFrequency = billingFrequency;
    }

    if (limit) {
      filters.limit = parseInt(limit, 10);
    }

    const clients = await firebaseAdminService.listClients(filters);

    // Apply search filter (server-side)
    let filteredClients = clients;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredClients = clients.filter((client: Client) =>
        client.clientName.toLowerCase().includes(searchLower) ||
        client.siteName.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortBy && sortOrder) {
      filteredClients.sort((a: any, b: any) => {
        let comparison = 0;

        switch (sortBy) {
          case 'clientName':
            comparison = a.clientName.localeCompare(b.clientName, 'ja');
            break;
          case 'createdAt':
            comparison = a.createdAt.toDate().getTime() - b.createdAt.toDate().getTime();
            break;
          case 'managementFee':
            comparison = a.managementFee - b.managementFee;
            break;
          default:
            break;
        }

        return sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    res.json({
      success: true,
      data: {
        clients: filteredClients,
        total: filteredClients.length
      }
    });

  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: 'クライアント一覧の取得に失敗しました。'
    });
  }
}

// POST /api/clients - Create new client
async function handleCreateClient(req: any, res: any) {
  try {
    const clientData = req.body;

    // Validate input data
    const validation = validateClientData(clientData);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: '入力データに問題があります。',
        errors: validation.errors
      });
      return;
    }

    // Create client
    const clientId = await firebaseAdminService.createClient({
      clientName: clientData.clientName.trim(),
      siteName: clientData.siteName.trim(),
      postalCode: clientData.postalCode.trim(),
      address1: clientData.address1.trim(),
      address2: clientData.address2?.trim() || '',
      billingFrequency: clientData.billingFrequency,
      managementFee: clientData.managementFee,
      managementStartDate: clientData.managementStartDate,
      contractStartDate: clientData.contractStartDate,
      contractEndDate: clientData.contractEndDate || null,
      feeChangeDate: clientData.feeChangeDate || null,
      newManagementFee: clientData.newManagementFee || null,
      isActive: true
    });

    res.status(201).json({
      success: true,
      data: { id: clientId },
      message: 'クライアントを作成しました。'
    });

  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({
      success: false,
      message: 'クライアントの作成に失敗しました。'
    });
  }
}

// PUT /api/clients/:id - Update client
async function handleUpdateClient(req: any, res: any, path: string) {
  try {
    // Extract client ID from path
    const pathParts = path.split('/');
    const clientId = pathParts[pathParts.length - 1];

    if (!clientId) {
      res.status(400).json({
        success: false,
        message: 'クライアントIDが必要です。'
      });
      return;
    }

    const updateData = req.body;

    // Validate input data (partial validation for updates)
    if (updateData.clientName && updateData.clientName.trim().length < 2) {
      res.status(400).json({
        success: false,
        message: 'クライアント名は2文字以上で入力してください。'
      });
      return;
    }

    // Update client
    await firebaseAdminService.updateClient(clientId, updateData);

    res.json({
      success: true,
      message: 'クライアント情報を更新しました。'
    });

  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({
      success: false,
      message: 'クライアント情報の更新に失敗しました。'
    });
  }
}

// DELETE /api/clients/:id - Delete client (logical deletion)
async function handleDeleteClient(req: any, res: any, path: string) {
  try {
    // Extract client ID from path
    const pathParts = path.split('/');
    const clientId = pathParts[pathParts.length - 1];

    if (!clientId) {
      res.status(400).json({
        success: false,
        message: 'クライアントIDが必要です。'
      });
      return;
    }

    // Check if client exists
    const client = await firebaseAdminService.getClient(clientId);
    if (!client) {
      res.status(404).json({
        success: false,
        message: 'クライアントが見つかりません。'
      });
      return;
    }

    // Perform logical deletion
    await firebaseAdminService.updateClient(clientId, { isActive: false });

    res.json({
      success: true,
      message: 'クライアントを削除しました。'
    });

  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({
      success: false,
      message: 'クライアントの削除に失敗しました。'
    });
  }
}