// department.module.ts
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { Department } from '@/entities/department.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  providers: [DepartmentService, Department],
  controllers: [DepartmentController],
  exports: [DepartmentService],
})
export class DepartmentModule {}
