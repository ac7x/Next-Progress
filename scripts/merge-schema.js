const fs = require('fs');
const path = require('path');

try {
  const schemaDir = path.join(__dirname, '../prisma/schema');
  const outputFile = path.join(__dirname, '../prisma/schema.prisma');
  const templateFile = path.join(__dirname, '../prisma/schema.prisma.template');

  // 檢查必要目錄
  if (!fs.existsSync(schemaDir)) {
    console.error('Schema directory not found!');
    process.exit(1);
  }

  // 檢查模板文件
  if (!fs.existsSync(templateFile)) {
    console.error('Template schema file not found!');
    process.exit(1);
  }

  // 讀取基礎模板
  const baseSchema = fs.readFileSync(templateFile, 'utf-8');

  // 按順序讀取和合併領域模型檔案 - 修改合成順序，先載入核心模型
  const modelOrder = [
    'User.prisma',            // 首先載入 User 模型，因為許多其他模型依賴它
    'Tag.prisma',            // Tag 模型被多個其他模型引用
    'Asset.prisma',          // Asset 相關模型
    'Project.prisma',        // Project 相關模型
    'Attachment.prisma',     // 附件模型
    'Warehouse.prisma',      // 倉庫相關模型
    'Linepay.prisma',        // 支付相關模型
    'Template.prisma',        // 支付相關模型
    'Instance.prisma',        // 支付相關模型
  ];

  // 檢查檔案是否存在並顯示警告
  const availableFiles = fs.readdirSync(schemaDir);
  console.log('Available schema files:', availableFiles);

  const domainSchemas = modelOrder
    .map(fileName => {
      const filePath = path.join(schemaDir, fileName);
      if (!fs.existsSync(filePath)) {
        console.warn(`Warning: Schema file ${fileName} not found`);
        // 嘗試檢查大小寫不敏感的匹配
        const lowerFileName = fileName.toLowerCase();
        const possibleMatch = availableFiles.find(f => f.toLowerCase() === lowerFileName);
        if (possibleMatch) {
          console.log(`Found possible match: ${possibleMatch}`);
          return fs.readFileSync(path.join(schemaDir, possibleMatch), 'utf-8');
        }
        return '';
      }
      return fs.readFileSync(filePath, 'utf-8');
    })
    .filter(content => content !== '');

  // 合併 schema
  const mergedSchema = [baseSchema, ...domainSchemas].join('\n\n');

  // 直接覆寫輸出文件
  fs.writeFileSync(outputFile, mergedSchema);
  console.log('Schema files merged successfully! 🎉');
} catch (error) {
  console.error('Error during schema merge:', error);
  process.exit(1);
}