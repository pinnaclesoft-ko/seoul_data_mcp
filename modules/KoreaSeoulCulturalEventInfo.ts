import {
    Tool,
} from "@modelcontextprotocol/sdk/types.js";

const API_URL = "http://openapi.seoul.go.kr:8088/{authKey}/json/culturalEventInfo/{StartIndex}/{EndIndex}";
const API_KEY = "";

export interface CulturalEventInfoArgs {
  startIndex: number;
  endIndex: number;
}

export const CulturalEventInfoTool: Tool = {
  name: "CulturalEventInfo",
  description: 
  `
  서울시 문화행사 정보를 조회할 수 있는 도구입니다.

  서울문화포털에서 제공하는 문화행사 정보입니다.
  공연, 행사에 대한 장소, 날짜, 기관명, 이용대상, 이용요금, 출연자, 프로그램 등의 정보를 제공합니다.


  반환되는 데이터는 JSON 형식으로 제공되며, 반환되는 데이터의 구조는 다음과 같습니다:

    list_total_count: 총 데이터 건수
    RESULT.CODE: 결과 코드
    RESULT.MESSAGE: 결과 메시지
    row: 데이터 배열
      
      각 데이터는 다음과 같은 필드를 포함합니다:

      CODENAME: 분류
      GUNAME: 자치구
      TITLE: 공연/행사명
      DATE: 날짜/시간
      PLACE: 장소
      ORG_NAME: 기관명
      USE_TRGT: 이용대상
      USE_FEE: 이용요금
      PLAYER: 출연자정보
      PROGRAM: 프로그램소개
      ETC_DESC: 기타정보
      ORG_LINK: 홈페이지 주소
      MAIN_IMG: 대표이미지
      RGSTDATE: 등록일
      TICKET: 시민/기관
      STRTDATE: 시작일
      END_DATE: 종료일
      THEMECODE: 테마분류
      LOT: 위도
      LAT: 경도
      IS_FREE: 무료여부
      HMPG_ADDR: 문화포털상세URL
  `,
  inputSchema: {
    type: "object",
    properties: {
      startIndex: {
        type: "number",
        description: "요청시작위치, 정수 입력 (페이징 시작번호 입니다 : 데이터 행 시작번호), 기본값 1을 사용합니다.",
      },
      endIndex: {
        type: "number",
        description: "요청종료위치, 정수 입력 (페이징 끝번호 입니다 : 데이터 행 끝번호), 기본값 10을 사용합니다. 최대값은 list_total_count입니다.",
      },
    },
    required: ["startIndex", "endIndex"],
  },
};

export const getCulturalEventInfo = async (args: CulturalEventInfoArgs): Promise<any> => {
    // Default values for optional parameters
    if (args.startIndex === undefined) {
        args.startIndex = 1;
    }
    if (args.endIndex === undefined) {
        args.endIndex = 10;
    }

    // Construct the URL with the provided arguments
    const { startIndex, endIndex } = args;
    const url = API_URL
        .replace("{authKey}", API_KEY)
        .replace("{StartIndex}", String(startIndex))
        .replace("{EndIndex}", String(endIndex))

    // Request the API
    console.error("Calling CulturalEventInfo with args:", args);
    const response = await fetch(url);
    console.error("Received response:", response);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }    
    
    // Check if the response is in JSON format
    const data = await response.json();
    if (data.culturalEventInfo === undefined) {
        throw new Error("Invalid response format: culturalEventInfo is undefined");
    }
    if (data.culturalEventInfo.RESULT.CODE !== "INFO-000") {
        throw new Error(`API error: ${data.culturalEventInfo.RESULT.CODE} - ${data.culturalEventInfo.RESULT.MESSAGE}`);
    }
    console.error("Received response:", data.culturalEventInfo);

    return JSON.stringify(data.culturalEventInfo);
}

