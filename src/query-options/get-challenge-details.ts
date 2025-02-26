import { queryOptions } from "@tanstack/react-query";
import { ChallengeDetail } from "@/utils/types";
import { queryFn } from "@/utils/fetch";

export function getChallengeDetails(id: string) {
  return queryOptions({
    queryKey: ["challenge", id],
    queryFn: queryFn<ChallengeDetail>(`/challenge/detail/${id}`),
  });
}
