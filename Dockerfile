FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY /dist/chatdrex-ui/browser /usr/share/nginx/html


EXPOSE 80
