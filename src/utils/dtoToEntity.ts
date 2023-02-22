/** dto映射实体（可反用，第一个参数传实体，第二个参数传dto，即可将实体映射到dto） */
export const dtoToEntity = (dto: any, entity: any) => {
  Object.keys(entity).forEach((key) => {
    if (dto.hasOwnProperty(key)) {
      entity[key] = dto[key];
    }
  });
};
