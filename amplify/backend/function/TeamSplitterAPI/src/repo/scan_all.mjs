import { ScanCommand } from "@aws-sdk/lib-dynamodb";

// A single Scan returns at most 1MB of the table; follow LastEvaluatedKey so items past the first page
// aren't silently dropped (the prod poll table outgrew one page and new polls stopped showing up)
export const scanAll = async (dynamo, params) => {
  const items = [];
  let lastKey;
  do {
    const page = await dynamo.send(new ScanCommand({ ...params, ExclusiveStartKey: lastKey }));
    items.push(...(page.Items || []));
    lastKey = page.LastEvaluatedKey;
  } while (lastKey);
  return { Items: items, Count: items.length };
}
