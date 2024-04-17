import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'geodata' })
export class GeoData extends Model<GeoData> {
  @Column
  file_name: string;

  @Column(DataType.JSONB)
  data: object;
}
