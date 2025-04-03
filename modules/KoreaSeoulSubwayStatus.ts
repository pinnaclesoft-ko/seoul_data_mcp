import {
    Tool,
} from "@modelcontextprotocol/sdk/types.js";

const API_URL = "http://openapi.seoul.go.kr:8088/{authKey}/json/CardSubwayStatsNew/{StartIndex}/{EndIndex}/{YYYYMMDD}/{SubwayLineNo}/{SubwayStationName}";
const API_KEY = "";

export interface KoreaSeoulSubwayStatusArgs {
  startIndex: number;
  endIndex: number;
  date: string;
  subwayLineNo: string;
  subwayStationName: string;
}

export const KoreaSeoulSubwayStatusTool: Tool = {
  name: "KoreaSeoulSubwayStatus",
  description: 
  `
  서울시 지하철호선별 역별 승하차 인원 정보를 조회할 수 있는 도구입니다. 

  날짜는 YYYYMMDD 형식으로 입력해야 하며,
  지하철역 이름은 한글로 입력해야 합니다.
  예를 들어, "서울역"은 "서울"과 같은 형식입니다.
  지하철 노선 번호는 "1호선", "2호선"과 같은 형식으로 입력해야 합니다.

  반환되는 데이터는 JSON 형식으로 제공되며, 반환되는 데이터의 구조는 다음과 같습니다:

    list_total_count: 총 데이터 건수
    RESULT.CODE: 결과 코드
    RESULT.MESSAGE: 결과 메시지
    row: 데이터 배열
      
      각 데이터는 다음과 같은 필드를 포함합니다:

      USE_YMD: 사용일자
      SBWY_ROUT_LN_NM: 호선명
      SBWY_STNS_NM: 역명
      GTON_TNOPE: 승차인원
      GTOFF_TNOPE: 하차인원
      REG_YMDT: 등록일자
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
        description: "요청종료위치, 정수 입력 (페이징 끝번호 입니다 : 데이터 행 끝번호), 기본값 10을 사용합니다.",
      },
      date: {
        type: "string",
        description: "사용일자, YYYYMMDD 형식의 문자열.",
      },
      subwayLineNo: {
        type: "string",
        description: "한국 서울 지하철 호선명. 지하철 호선(공백시 %20으로 조회)",
      },
      subwayStationName: {
        type: "string",
        description: "한국 서울 지하철 역명.",
      },
    },
    required: ["date", "subwayLineNo", "subwayStationName"],
  },
};

export const getKoreaSeoulSubwayStatus = async (args: KoreaSeoulSubwayStatusArgs): Promise<any> => {
    // Default values for optional parameters
    if (args.startIndex === undefined) {
        args.startIndex = 1;
    }
    if (args.endIndex === undefined) {
        args.endIndex = 10;
    }
    if (args.date === undefined) {
        args.date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    }
    if (args.subwayLineNo === undefined) {
        args.subwayLineNo = "1호선";
    }
    if (args.subwayStationName === undefined) {
        args.subwayStationName = "서울";
    }

    // Construct the URL with the provided arguments
    const { startIndex, endIndex, date, subwayLineNo, subwayStationName } = args;
    const url = API_URL
        .replace("{authKey}", API_KEY)
        .replace("{StartIndex}", String(startIndex))
        .replace("{EndIndex}", String(endIndex))
        .replace("{YYYYMMDD}", date)
        .replace("{SubwayLineNo}", subwayLineNo)
        .replace("{SubwayStationName}", subwayStationName);

    // Request the API
    console.error("Calling KoreaSeoulSubwayStatus with args:", args);
    const response = await fetch(url);
    console.error("Received response:", response);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }    
    
    // Check if the response is in JSON format
    const data = await response.json();
    if (data.CardSubwayStatsNew === undefined) {
        throw new Error("Invalid response format: CardSubwayStatsNew is undefined");
    }
    if (data.CardSubwayStatsNew.RESULT.CODE !== "INFO-000") {
        throw new Error(`API error: ${data.CardSubwayStatsNew.RESULT.CODE} - ${data.CardSubwayStatsNew.RESULT.MESSAGE}`);
    }
    console.error("Received response:", data.CardSubwayStatsNew);

    return JSON.stringify(data.CardSubwayStatsNew);
}

