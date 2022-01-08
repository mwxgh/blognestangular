import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { environment } from '../../../../environments/environment';

// import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const excel = require('excel4node');

@Injectable()
export class ExportXlsxService {
  async exportFileXlsx(data, title: string): Promise<any> {
    const workbook = new excel.Workbook();

    const style = workbook.createStyle({
      font: { color: '#192038', size: 11 },
    });
    const styleTitle = workbook.createStyle({
      font: {
        bold: true,
        size: 16,
        color: '#192038',
      },
      alignment: {
        wrapText: true,
        horizontal: 'center',
      },
    });
    const worksheet = workbook.addWorksheet('Sheet 1');
    worksheet.row(1).group(1);
    worksheet.cell(1, 1, 1, 7, true).string(title).style(styleTitle);
    data.forEach((item, rowIndex) => {
      let i = 1;
      for (const property in item) {
        if (typeof item[property] === 'number') {
          worksheet.cell(rowIndex + 2, i).number(item[property]);
        } else {
          worksheet
            .cell(rowIndex + 2, i)
            .string(item[property])
            .style(style);
        }
        i++;
      }
    });

    const filename = `${Date.now()}.xlsx`;
    const filePath = join(__dirname, 'public', 'uploads', filename);

    workbook.write(filePath);
    const url = environment.appUrl + '/public/uploads/' + filename;
    return url;
  }
}
