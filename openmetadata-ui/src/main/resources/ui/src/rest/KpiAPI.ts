/*
 *  Copyright 2022 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { AxiosResponse } from 'axios';
import { Operation } from 'fast-json-patch';
import { PagingResponse } from 'Models';
import { CreateKpiRequest } from '../generated/api/dataInsight/kpi/createKpiRequest';
import { Kpi, KpiResult } from '../generated/dataInsight/kpi/kpi';

import { ListParams } from '../interface/API.interface';
import { getEncodedFqn } from '../utils/StringsUtils';
import APIClient from './index';

export type KpiResultParam = {
  startTs: number;
  endTs: number;
};

export const getListKPIs = async (params?: ListParams) => {
  const response = await APIClient.get<PagingResponse<Kpi[]>>('/kpi', {
    params,
  });

  return response.data;
};
export const postKPI = async (data: CreateKpiRequest) => {
  const response = await APIClient.post<CreateKpiRequest, AxiosResponse<Kpi>>(
    '/kpi',
    data
  );

  return response.data;
};
export const putKPI = async (data: CreateKpiRequest) => {
  const response = await APIClient.put<CreateKpiRequest, AxiosResponse<Kpi>>(
    '/kpi',
    data
  );

  return response.data;
};

export const patchKPI = async (id: string, data: Operation[]) => {
  const response = await APIClient.patch<Operation[], AxiosResponse<Kpi>>(
    `/kpi/${id}`,
    data
  );

  return response.data;
};

export const getKPIByName = async (fqn: string, params?: ListParams) => {
  const response = await APIClient.get<Kpi>(`/kpi/name/${getEncodedFqn(fqn)}`, {
    params,
  });

  return response.data;
};

export const getListKpiResult = async (
  fqn: string,
  params: KpiResultParam,
  orderBy = 'ASC'
) => {
  const response = await APIClient.get<PagingResponse<KpiResult[]>>(
    `/kpi/${getEncodedFqn(fqn)}/kpiResult`,
    { params: { ...params, orderBy } }
  );

  return response.data;
};
export const getLatestKpiResult = async (fqn: string) => {
  const response = await APIClient.get<KpiResult>(
    `/kpi/${getEncodedFqn(fqn)}/latestKpiResult`
  );

  return response.data;
};
