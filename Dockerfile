FROM node:12.12.0-alpine
ENV PATH /usr/local/bin:$PATH
WORKDIR /network-tdt
copy . /network-tdt
RUN npm install
EXPOSE 8080
CMD ["npm", "start"]