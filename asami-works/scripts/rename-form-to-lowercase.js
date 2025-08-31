const fs = require('fs');
const path = require('path');

console.log('🔄 Form → form への変換を開始します...\n');

// 1. ディレクトリ名を変更
const srcAppPath = path.join(__dirname, '../src/app');
const oldPath = path.join(srcAppPath, 'Form');
const newPath = path.join(srcAppPath, 'form');

if (fs.existsSync(oldPath)) {
  fs.renameSync(oldPath, newPath);
  console.log('✅ ディレクトリ名を変更: Form → form');
} else {
  console.log('⚠️  src/app/Form ディレクトリが見つかりません');
}

// 2. ファイル内のパスを更新
const filesToUpdate = [
  'src/app/form/page.tsx',
  'src/app/contact/metadata.ts',
  'src/app/privacy/page.tsx',
  'src/app/terms/page.tsx',
  'src/app/services/corporate/page.tsx',
  'src/app/services/lp/page.tsx',
  'src/app/services/grant/page.tsx',
  'src/components/sections/Hero.tsx',
  'src/components/sections/Services.tsx',
  'src/components/Footer.tsx',
  'src/components/Header.tsx'
];

console.log('\n📝 ファイルを更新中...\n');

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // パスを更新
    content = content.replace(/\/Form/g, '/form');
    content = content.replace(/\.\/Form\.module\.css/g, './form.module.css');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ 更新: ${file}`);
    }
  } else {
    console.log(`⚠️  ファイルが見つかりません: ${file}`);
  }
});

// 3. CSSファイル名も変更
const oldCssPath = path.join(srcAppPath, 'form/Form.module.css');
const newCssPath = path.join(srcAppPath, 'form/form.module.css');

if (fs.existsSync(oldCssPath)) {
  fs.renameSync(oldCssPath, newCssPath);
  console.log('\n✅ CSSファイル名を変更: Form.module.css → form.module.css');
}

console.log('\n✨ 完了！');
console.log('\n🎯 次のステップ:');
console.log('1. npm run dev でローカルで動作確認');
console.log('2. npm run build でビルド');
console.log('3. firebase deploy --only hosting でデプロイ');