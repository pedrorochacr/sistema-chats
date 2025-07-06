import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  Default,
} from "sequelize-typescript";

@Table
class Log extends Model<Log> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Default(null)
  @Column
  content: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Log;
