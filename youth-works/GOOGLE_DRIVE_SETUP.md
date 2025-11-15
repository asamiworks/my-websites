# Google Drive API -šK

Sn·¹ÆàgoËBøPDF’êÕ„kGoogle Drivek¢Ã×íüÉY‹_ıLBŠ~Y

## 1. Google Cloud Consoleg×í¸§¯È’\

1. [Google Cloud Console](https://console.cloud.google.com/) k¢¯»¹
2. °WD×í¸§¯È’\~_oâXn×í¸§¯È’x	

## 2. Google Drive API’	¹

1. ætnáËåüK‰APIhµüÓ¹’é¤Öéê’x
2. Google Drive API’"
3. 	¹kY‹’¯êÃ¯

## 3. µüÓ¹¢«¦óÈ’\

1. APIhµüÓ¹’<Å1’x
2. <Å1’\’µüÓ¹¢«¦óÈ’x
3. µüÓ¹¢«¦óÈ’e›‹invoice-uploader	
4. \WfšL’¯êÃ¯
5. íüëojngŒ†’¯êÃ¯

## 4. µüÓ¹¢«¦óÈ­ü’

1. \W_µüÓ¹¢«¦óÈ’¯êÃ¯
2. ­ü¿Ö’x
3. u’ı ’°WDu’\’x
4. ­ün¿¤×oJSON’x
5. \’¯êÃ¯
6. JSONÕ¡¤ëLÀ¦óíüÉUŒ~Y

## 5. Google DrivegÕ©ëÀ’q	

1. Google DrivegËBø’İXY‹Õ©ëÀ’‹O
   - Õ©ëÀID: `1asd9c8BJyv8HP_5PBnKBumHL_UFbMscC`
   - URL: https://drive.google.com/drive/folders/1asd9c8BJyv8HP_5PBnKBumHL_UFbMscC

2. Õ©ëÀ’ó¯êÃ¯’q	’x

3. À¦óíüÉW_JSONÕ¡¤ë’‹M`client_email`n$’³Ôü
   - ‹: `invoice-uploader@your-project-123456.iam.gserviceaccount.com`

4. ³ÔüW_áüë¢Éì¹’q	Hkı 
   - )PoèÆk-š

## 6. °ƒ	p’-š

1. ×í¸§¯ÈnëüÈÇ£ì¯Èêk `.env.local` Õ¡¤ë’\

2. À¦óíüÉW_JSONÕ¡¤ën…¹’³Ôü

3. `.env.local` kånbg-š:

```bash
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS='{"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"invoice-uploader@your-project-123456.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'

GOOGLE_DRIVE_FOLDER_ID=1asd9c8BJyv8HP_5PBnKBumHL_UFbMscC
```

**Í**: JSONn…¹o9L’+Z1LgğWfO`UD

## 7. ‹zµüĞü’wÕ

```bash
npm run dev
```

## Õ\º

ËBø’Y‹hêÕ„kGoogle DrivenšÕ©ëÀ…kt%Õ©ëÀL\UŒPDFL¢Ã×íüÉUŒ~Y

‹
- `2025t11/INV-202511-CLI-0001.pdf`
- `2025t12/INV-202512-CLI-0001.pdf`

## ÈéÖë·åüÆ£ó°

### ¨éü: "Google Drive is not configured"
- `.env.local`Õ¡¤ëLcWO\UŒfD‹Kº
- ‹zµüĞü’wÕ

### ¨éü: "Permission denied"
- µüÓ¹¢«¦óÈnáüë¢Éì¹kÕ©ëÀnèÆ)PLØUŒfD‹Kº
- Õ©ëÀIDLcWDKº

### ¢Ã×íüÉoŸY‹LGoogle Drivekh:UŒjD
- WB“LKK‹4LBŠ~YpÒp	
- Google Drive’­¼WffO`UD
