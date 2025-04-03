#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { 
  getKoreaSeoulSubwayStatus, 
  KoreaSeoulSubwayStatusArgs, 
  KoreaSeoulSubwayStatusTool 
} from "./modules/KoreaSeoulSubwayStatus.js";
import { CulturalEventInfoArgs, CulturalEventInfoTool, getCulturalEventInfo } from "./modules/KoreaSeoulCulturalEventInfo.js";


const server = new Server(
  {
    name: "Korea Seoul Data MCP Server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);


server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error("Received ListToolsRequest");

  return {
    tools: [
      KoreaSeoulSubwayStatusTool,
      CulturalEventInfoTool
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
  console.error("Received CallToolRequest:", request);

  try {
    if (!request.params.arguments) {
      throw new Error("No arguments provided");
    }

    switch (request.params.name) {
      case "KoreaSeoulSubwayStatus": {
        
        const args = request.params.arguments as unknown as KoreaSeoulSubwayStatusArgs;
        const response = await getKoreaSeoulSubwayStatus(args);

        return {
          content: [
            {
              type: "text",
              text: response,
            },
          ],
        }
      }

      case "CulturalEventInfo": {
        const args = request.params.arguments as unknown as CulturalEventInfoArgs;
        const response = await getCulturalEventInfo(args);

        return {
          content: [
            {
              type: "text",
              text: response,
            },
          ],
        }
      }

    }
  } catch (error) {
    console.error("Error executing tool:", error);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
          }),
        },
      ],
    };
  }

  return {
    content: [{
      type: "text",
      text: `Unknown tool: ${request.params.name}`
    }],
    isError: true
  };
});

async function runServer() {
  const transport = new StdioServerTransport();
  console.error("Connecting server to transport...");
  await server.connect(transport);
  console.error("KoreaSeoul MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});


// Example usage of the KoreaSeoulSubwayStatus function
// const main = async () => {
//   const args = {
//     startIndex: 1,
//     endIndex: 10,
//     date: "20231001",
//     subwayLineNo: "1호선",
//     subwayStationName: "서울",
//   };

//   try {
//     const response = await getKoreaSeoulSubwayStatus(args);
//     console.log("Response:", response);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// main().catch((error) => {
//   console.error("Fatal error running main:", error);
//   process.exit(1);
// });