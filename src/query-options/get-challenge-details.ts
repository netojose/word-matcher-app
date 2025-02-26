import { queryOptions } from "@tanstack/react-query";
import { ChallengeDetailDto } from "@/utils/types";
import { queryFn } from "@/utils/fetch";

export function getChallengeDetails(id: string) {
  return queryOptions({
    queryKey: ["challenge", id],
    queryFn: queryFn<ChallengeDetailDto>(`/challenge/detail/${id}`),
  });
}
