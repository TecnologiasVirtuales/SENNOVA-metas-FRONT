import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment.development';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const {api_url} = environment;
  req = req.clone({
    url:`${api_url}/${req.url}`
  })
  return next(req);
};
