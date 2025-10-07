import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAuth } from '@/lib/firebase/config';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    uid: string;
    email?: string | null;
    displayName?: string | null;
  };
}

export async function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      // Get authorization header
      const authHeader = req.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Extract token
      const token = authHeader.substring(7);

      // Verify token with Firebase Admin (in a real app)
      // For now, we'll do basic validation
      if (!token) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }

      // Create authenticated request
      const authenticatedRequest = req as AuthenticatedRequest;
      authenticatedRequest.user = {
        uid: 'demo-user-id', // In real implementation, extract from token
        email: 'demo@example.com',
        displayName: 'Demo User'
      };

      return handler(authenticatedRequest);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

export function requireAuth(roles?: string[]) {
  return withAuth;
}