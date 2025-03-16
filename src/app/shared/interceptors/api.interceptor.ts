import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment.development';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const {api_url} = environment;
  let {url} = req;
  let paths = url.split('/');
  switch(paths.at(0)){
    case 'api':
      req = req.clone({
        url:`${api_url}${req.url}`
      })
      break;
    default:
      break;
  }

  return next(req);
};
