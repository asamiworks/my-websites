import { google } from 'googleapis';
import { Readable } from 'stream';

export class GoogleDriveService {
  private drive;
  private rootFolderId: string;

  constructor() {
    // Google Drive APIの認証設定
    const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS
      ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS)
      : null;

    if (!credentials) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS environment variable is not set');
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    this.drive = google.drive({ version: 'v3', auth });
    this.rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1asd9c8BJyv8HP_5PBnKBumHL_UFbMscC';
  }

  /**
   * 年月フォルダを取得または作成（例: "2025年12月"）
   */
  async getOrCreateYearMonthFolder(year: number, month: number): Promise<string> {
    const folderName = `${year}年${month}月`;

    try {
      // 既存のフォルダを検索
      const response = await this.drive.files.list({
        q: `name='${folderName}' and '${this.rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
      });

      if (response.data.files && response.data.files.length > 0) {
        return response.data.files[0].id!;
      }

      // フォルダが存在しない場合は作成
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [this.rootFolderId],
      };

      const folder = await this.drive.files.create({
        requestBody: folderMetadata,
        fields: 'id',
      });

      return folder.data.id!;
    } catch (error) {
      console.error('Error creating/getting folder:', error);
      throw error;
    }
  }

  /**
   * PDFファイルをアップロード
   * ファイル名形式: "年月_クライアント名.pdf" (例: "202512_株式会社テスト.pdf")
   */
  async uploadPDF(
    pdfBuffer: Buffer,
    year: number,
    month: number,
    clientName: string
  ): Promise<string> {
    try {
      // 年月フォルダを取得または作成
      const folderId = await this.getOrCreateYearMonthFolder(year, month);

      // ファイル名を生成: "年月_クライアント名.pdf"
      const fileName = `${year}${String(month).padStart(2, '0')}_${clientName}.pdf`;

      // 既存のファイルを検索（同名ファイルがあれば上書き）
      const existingFiles = await this.drive.files.list({
        q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
        fields: 'files(id)',
      });

      let fileId: string;

      if (existingFiles.data.files && existingFiles.data.files.length > 0) {
        // 既存ファイルを更新
        fileId = existingFiles.data.files[0].id!;
        await this.drive.files.update({
          fileId,
          media: {
            mimeType: 'application/pdf',
            body: Readable.from(pdfBuffer),
          },
        });
      } else {
        // 新規ファイルを作成
        const fileMetadata = {
          name: fileName,
          parents: [folderId],
        };

        const media = {
          mimeType: 'application/pdf',
          body: Readable.from(pdfBuffer),
        };

        const file = await this.drive.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: 'id',
        });

        fileId = file.data.id!;
      }

      // ファイルのURLを生成
      const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;
      return fileUrl;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  }

  /**
   * フォルダのURLを取得
   */
  async getFolderUrl(year: number, month: number): Promise<string> {
    const folderId = await this.getOrCreateYearMonthFolder(year, month);
    return `https://drive.google.com/drive/folders/${folderId}`;
  }
}
