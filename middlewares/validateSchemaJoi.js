function validateSchemaJoi(method, schema) {
    async function validateSchema (ctx, next) {
      let data = undefined;
      if (method === 'get') {
        data = ctx.request.query;
      } else {
        data = ctx.request.body;
      }
      const { value, error } = schema.validate(data);
      if (error) {
        ctx.body = {
            code: 400,
            error
        };
      } else {
        next();
      }
    }
    return validateSchema;
  }
  
  module.exports =  validateSchemaJoi;