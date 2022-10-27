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
3. kubectl create -f 
4. 서버 실행 

```terminal
cd back;
yarn install;
yarn start;
```
6. 클라이언트 실행

```terminal
cd front;
yarn install;
yarn start;
```

## 차별점
1. 하나의 API 프레임워크에서 복수의 Database 서버 연결 및 실시간 토글 기능
2. 수백만 텍스트 Row에 대한 인덱싱, 캐싱 및 각 데이터베이스 별 특성 비교 
3. 3개 서버로 구현된 분산 시스템
4. 코드 재사용성과 3계층 구조, 루즈 커플링 등 Back-End 설계 방법론에 대한 이해 및 적용


## 시사점
1. 300만 row의 경우 캐싱, 인덱싱 미적용 시 MySQL(2초 이하)이 MongoDB(5초 이하) 대비 우수 / 캐싱, 인덱싱 적용 시 MySQL(1.1초 이하)과 MongoDB(1.3초 이하) 성능 유사 
2. MongoDB의 경우 자동 캐싱이 이루어지는데, 이로인해 텍스트 서치 시 응답 시간의 일관성이 매우 낮음 (최소 0.5초, 최대 5초) / MySQL의 경우 응답 시간의 일관성이 높음
3. 인덱싱 적용 시 응답시간 평균 1초 내외로 사용자 경험 측면에서 큰 문제가 되지 않음 / 추가 리소스 사용 및 서비스 복잡도를 높이는 샤딩은 수백만 데이터 수준에서는 불필요함
4. 서비스 개발 시 DB 선정 및 설계는 해당 DB의 특징(예를 들어 MongoDB의 자동 캐싱 및 RAM 관리의 필요성), 인덱싱 적용 시의 성능, 서비스의 목적 및 사용자 경험을 모두 고려하여 신중하게 결정해야 하며, 샤딩은 최후의 수단으로 그 이전에 파티셔닝, 캐싱, 인덱싱을 우선 시도해야 함
5. 분산 시스템에서 DB 전환 시 Back-End 서버에의 영향은 DB pool에 연결할 때 사용하는 패키지뿐이며, 컨트롤러와 서비스 로직은 그대로임. 따라서 3계층 구조와 루즈 커플링을 적용하는 것이 코드 재사용률을 극대화할 수 있음
6. React 18에 새로 도입된 Transition, Suspense는 특수한 경우(UI 전환 시의 메모리 부하가 큰 경우)에 의미가 있고, 이외에는 큰 용도가 없음
