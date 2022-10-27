## 목차
* [프로젝트 개요](#프로젝트-개요)
* [문제 인식](#문제-인식)
* [해결 방안](#해결-방안)
* [사용 기술](#사용-기술)
* [실행 방법](#실행-방법)
* [대표 코드](#대표-코드)
* [시사점](#시사점)


## 프로젝트 개요
마이크로서비스 기반 비동기 분산형 블로그 웹
- k8s, Event-Bus를 활용한 웹 서비스로 확장성, 안정성 극대화, 대용량 트래픽 대응
- Skaffold, Healm, Travis, Shell Script를 활용한 CI/CD 자동화

<br />

![image](https://user-images.githubusercontent.com/91174156/198219510-fba71782-8412-4af3-b298-bc42a9bed60d.png)

<br />

## 문제 인식
1. 블로그 포스팅 등 사용자 참여 시에 동기 데이터 처리를 할 경우 Latency 증가, UX 훼손 
2. 컨테이너 기반 아키텍쳐에서 대용량 트래픽 소화 시 서버 과부하 문제 발생, 확장성 저하
3. 데이터 처리 로직이 커질수록 캐싱, DB 간 inconsistency 증가

## 해결 방안
1. Event-Bus를 활용한 비동기 데이터 처리를 통해 Latency 및 UX 향상
2. k8s를 활용한 컨테이너 관리로 확장 자동화, 안정성 증대
3. Worker Thread 도입하여 Redis, DB 간 데이터 inconsistency 감소

## 사용 기술
* React 18
* Fastify 2.3
* Postgres  
* Event-Bus
* k8s, docker
	
## 실행 방법
1. GCP Kubernetes Engine 혹은 AWS EKS 실행 (터미널 환경) 
2. `git clone git@github.com:z3zzz/k8s-docker-blog-architecture.git` 
3. kubectl create -f k8s

## 차별점
1. 클라이언트 입장에서는 하나의 이벤트 처리로 UX 속도 향상되나, 서버에서는 비동기로 추가 이벤트 처리되어 기능 다양화
2. k8s를 통한 오토 스케일링, Nginx를 통한 로드 밸런싱으로 대용량 트래픽에 대한 확장성, 안정성 극대화
3. 각 마이크로서비스 간 이벤트 기반 연결 구조


## 시사점
1. Event-Bus 구조로 비동기 이벤트 처리 시 UX를 훼손하지 않고도 다양한 부가 기능 개발 가능
2. k8s는 컨테이너 기반 마이크로서비스 아키텍쳐의 배포를 위한 대부분의 기능(오토 스케일링, 로드 밸런싱, 컨테이너 라이프사이클 및 네트워크 관리 등)을 각 오브젝트 설정 파일(yaml 파일) 작성만으로 자동으로 처리해 줌
3. k8s는 오픈소스 프로젝트로 온프레미스 서버에서도 충분히 구현 가능하지만, 서버 수를 직접 관리해야 한다는 단점이 있음. 
4. 클라우드 VM을 이용하는 GCP Kubernetes Engine, AWS EKS를 활용할 시 yaml 파일 작성만으로 쉽게 k8s 개발이 가능하며, skaffold를 통한 dev, CI/CD 구축도 간편하지만, 비용 발생  
