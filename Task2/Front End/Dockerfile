FROM node:latest
WORKDIR "/app/Front End"
RUN git clone https://github.com/Santho257/CM-Task2-Front-End .
RUN npm install
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve","-s","dist"]
