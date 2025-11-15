import * as admin from 'firebase-admin';
import { Timestamp, DocumentSnapshot } from 'firebase-admin/firestore';

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID || 'asamiworks-679b3'
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

// Type definitions for data models
export interface Client {
  id: string;
  clientName: string;
  siteName: string;
  postalCode: string;
  address1: string;
  address2?: string;
  billingFrequency: 'monthly' | 'yearly';
  managementFee: number;
  managementStartDate: Timestamp;
  contractStartDate: Timestamp;
  contractEndDate?: Timestamp;
  feeChangeDate?: Timestamp;
  newManagementFee?: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  billingYear: number;
  billingMonth: number;
  issueDate: Timestamp;
  managementFee: number;
  feeStartDate: Timestamp;
  feeEndDate: Timestamp;
  adjustmentAmount: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  pdfUrl: string;
  driveFileId: string;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  paidAmount?: number;
  paidDate?: Timestamp;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CompanyInfo {
  id: 'default';
  companyName: string;
  representative: string;
  postalCode: string;
  address1: string;
  address2: string;
  phone: string;
  email: string;
  bankName: string;
  branchName: string;
  accountType: string;
  accountNumber: string;
  accountHolder: string;
  taxRate: number;
  defaultPaymentDeadline: string;
  invoicePrefix: string;
  updatedAt: Timestamp;
}

export interface InvoiceCounter {
  id: string; // YYYY-MM format
  year: number;
  month: number;
  counter: number;
  lastInvoiceNumber: string;
  updatedAt: Timestamp;
}

export interface ExecutionLog {
  id: string;
  executedAt: Timestamp;
  executionType: 'manual' | 'automatic';
  targetYearMonth: string;
  successCount: number;
  errorCount: number;
  totalCount: number;
  generatedInvoices: string[];
  errors?: {
    clientId: string;
    clientName: string;
    errorMessage: string;
  }[];
  notes: string;
}

// Firebase Service Class
export class FirebaseAdminService {

  // Client operations
  async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const clientData = {
      ...data,
      createdAt: now,
      updatedAt: now
    };

    const docRef = await adminDb.collection('clients').add(clientData);
    return docRef.id;
  }

  async updateClient(id: string, data: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<void> {
    const updateData = {
      ...data,
      updatedAt: Timestamp.now()
    };

    await adminDb.collection('clients').doc(id).update(updateData);
  }

  async getClient(id: string): Promise<Client | null> {
    const doc = await adminDb.collection('clients').doc(id).get();
    if (!doc.exists) return null;

    return {
      id: doc.id,
      ...doc.data()
    } as Client;
  }

  async listClients(filters?: {
    isActive?: boolean;
    billingFrequency?: 'monthly' | 'yearly';
    limit?: number;
  }): Promise<Client[]> {
    let query = adminDb.collection('clients') as any;

    if (filters?.isActive !== undefined) {
      query = query.where('isActive', '==', filters.isActive);
    }

    if (filters?.billingFrequency) {
      query = query.where('billingFrequency', '==', filters.billingFrequency);
    }

    query = query.orderBy('createdAt', 'desc');

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc: DocumentSnapshot) => ({
      id: doc.id,
      ...doc.data()
    })) as Client[];
  }

  // Invoice operations
  async createInvoice(data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const invoiceData = {
      ...data,
      createdAt: now,
      updatedAt: now
    };

    const docRef = await adminDb.collection('invoices').add(invoiceData);
    return docRef.id;
  }

  async updateInvoice(id: string, data: Partial<Omit<Invoice, 'id' | 'createdAt'>>): Promise<void> {
    const updateData = {
      ...data,
      updatedAt: Timestamp.now()
    };

    await adminDb.collection('invoices').doc(id).update(updateData);
  }

  async getInvoice(id: string): Promise<Invoice | null> {
    const doc = await adminDb.collection('invoices').doc(id).get();
    if (!doc.exists) return null;

    return {
      id: doc.id,
      ...doc.data()
    } as Invoice;
  }

  async listInvoices(filters?: {
    year?: number;
    month?: number;
    status?: string;
    limit?: number;
  }): Promise<Invoice[]> {
    let query = adminDb.collection('invoices') as any;

    if (filters?.year) {
      query = query.where('billingYear', '==', filters.year);
    }

    if (filters?.month) {
      query = query.where('billingMonth', '==', filters.month);
    }

    if (filters?.status) {
      query = query.where('status', '==', filters.status);
    }

    query = query.orderBy('createdAt', 'desc');

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc: DocumentSnapshot) => ({
      id: doc.id,
      ...doc.data()
    })) as Invoice[];
  }

  // Counter operations (with transaction)
  async getNextInvoiceNumber(year: number, month: number): Promise<string> {
    const counterId = `${year}-${String(month).padStart(2, '0')}`;
    const counterRef = adminDb.collection('invoiceCounters').doc(counterId);

    return await adminDb.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);

      let newCounter = 1;
      if (counterDoc.exists) {
        const currentCounter = counterDoc.data()?.counter || 0;
        newCounter = currentCounter + 1;
      }

      const invoiceNumber = `INV-${year}-${String(month).padStart(2, '0')}-${String(newCounter).padStart(3, '0')}`;

      const counterData: InvoiceCounter = {
        id: counterId,
        year,
        month,
        counter: newCounter,
        lastInvoiceNumber: invoiceNumber,
        updatedAt: Timestamp.now()
      };

      transaction.set(counterRef, counterData);
      return invoiceNumber;
    });
  }

  // Company info operations
  async getCompanyInfo(): Promise<CompanyInfo | null> {
    const doc = await adminDb.collection('companyInfo').doc('default').get();
    if (!doc.exists) return null;

    return doc.data() as CompanyInfo;
  }

  async updateCompanyInfo(data: Partial<Omit<CompanyInfo, 'id'>>): Promise<void> {
    const updateData = {
      ...data,
      updatedAt: Timestamp.now()
    };

    await adminDb.collection('companyInfo').doc('default').update(updateData);
  }

  // Execution logging
  async logExecution(data: Omit<ExecutionLog, 'id'>): Promise<string> {
    const docRef = await adminDb.collection('executionLogs').add(data);
    return docRef.id;
  }

  // Helper method to check if user is admin
  async isUserAdmin(uid: string): Promise<boolean> {
    try {
      const userRecord = await adminAuth.getUser(uid);
      return userRecord.customClaims?.admin === true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // Helper method to set admin claims
  async setAdminClaim(uid: string, isAdmin: boolean): Promise<void> {
    await adminAuth.setCustomUserClaims(uid, { admin: isAdmin });
  }
}

// Export singleton instance
export const firebaseAdminService = new FirebaseAdminService();