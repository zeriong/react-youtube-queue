## 🔊 Youtube Queue-player
유튜브 url을 신청하면 queue-list에 쌓이고 순차적으로 실행시켜주는 앱입니다.<br><br>
기본적인 정책을 Single / Group 으로 구분하고 Group은 신청하면 허용하는 방식을 설계중입니다.<br>
기존 정책과 동일하게 Group은 role이 Speaker /Requester로 구분됩니다.<br>
플레이어를 출력하는 역할과 플레이어 상태 변경만을 요청하는 역할로 나뉘게 됩니다.

<br>

## 📌 Notice
현재 전체적인 버전을 마이그레이션중에 있습니다.<br>
쉽고 빠른 마이그레이션을 목표로, 새로운 create-tsrouter를 통해<br>
`vite-mig`폴더에 점진적으로 마이그레이션 할 예정입니다.

- React19.x
- webpack -> vite
- biome 추가
- TS 추가
- React-Dom-Router -> Tanstack-Router
- tailwindcss 
