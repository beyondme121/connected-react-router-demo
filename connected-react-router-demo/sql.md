## 满意度By服务团队(折线图)
```sql
select  a.ServiceTeam,
        a.SatificationOrderCount,
        a.TotalSatificationOrderCount,
        CASE WHEN a.TotalSatificationOrderCount = 0 THEN 0 ELSE CONVERT(DECIMAL, a.SatificationOrderCount) /a.TotalSatificationOrderCount END Ratio
from (
	SELECT  b.ServiceTeam ,
			SUM(CASE WHEN a.CustomerSatification IN ( '', N'满意' ) THEN 1
					 ELSE 0
				END) SatificationOrderCount ,
			COUNT(a.FieldServiceOrderID) TotalSatificationOrderCount
	FROM    DW.viCareFieldServiceOrder a
			INNER JOIN DW.vABBFieldServiceEngineer b ON a.ServiceEngineerID = b.Userid
	WHERE   a.FiedServiceOrderStatus NOT IN ( N'已拒绝', N'已取消' )
			AND a.CreatedDateTime >= DATEADD(YEAR, DATEDIFF(YEAR, 0, DATEADD(HH, +8, GETDATE())), 0)
			AND a.CreatedDateTime <= DATEADD(HH, +8, GETDATE())
	GROUP BY b.ServiceTeam
) a 
```

## 一次修复率By服务团队（折线图）
```sql
SELECT  ServiceTeam ,
        OneMoreTimeRepair ,
        ServiceTimes ,
        ( CASE WHEN t2.ServiceTimes IS NOT NULL
                    AND t2.ServiceTimes > 0
               THEN 1 - ( CONVERT(DECIMAL, ISNULL(t2.OneMoreTimeRepair, 0))
                          / ISNULL(t2.ServiceTimes, 0) )
               ELSE 1
          END ) AS OnceRepairRatio
FROM    ( SELECT    b.ServiceTeam ,
                    SUM(CASE WHEN a.ServiceContent LIKE N'%维修%'
                             THEN a.OneMoreTimeRepair
                             ELSE 0
                        END) OneMoreTimeRepair ,
                    COUNT(*) ServiceTimes
          FROM      DW.viCareFieldServiceOrder a
                    INNER JOIN DW.vABBFieldServiceEngineer b ON a.ServiceEngineerID = b.Userid
          WHERE     a.FiedServiceOrderStatus NOT IN ( N'已拒单', N'已取消' )
                    AND a.CreatedDateTime BETWEEN DATEADD(YEAR,
                                                          DATEDIFF(YEAR, 0,
                                                              DATEADD(HH, +8,
                                                              GETDATE())), 0)
                                          AND     DATEADD(HH, +8, GETDATE())
          GROUP BY  b.ServiceTeam
        ) t2
ORDER BY 4 ASC;
```

## Top 10 服务站满意度 (折线图)
```sql
select TOP 10 a.ParentServiceStationNameCN,
	a.SatificationOrderCount,
	a.TotalSatificationOrderCount,
	CASE WHEN a.TotalSatificationOrderCount = 0 THEN 0 
		 ELSE CONVERT(DECIMAL, ISNULL(a.SatificationOrderCount, 0)) / a.TotalSatificationOrderCount
	END
 from (
SELECT  c.ParentServiceStationNameCN,
        SUM(CASE WHEN a.CustomerSatification IN ( '', N'满意' ) THEN 1
                 ELSE 0
            END) SatificationOrderCount ,
        ISNULL(COUNT(a.FieldServiceOrderID), 0) TotalSatificationOrderCount

FROM    DW.viCareFieldServiceOrder a
        INNER JOIN DW.viCareServiceStation c ON a.ServiceProviderCompanyID = c.ServiceStationID
WHERE   a.FiedServiceOrderStatus NOT IN ( N'已拒绝', N'已取消' )
        AND a.CreatedDateTime >= DATEADD(YEAR, DATEDIFF(YEAR, 0, DATEADD(HH, +8, GETDATE())), 0)
        AND a.CreatedDateTime <= DATEADD(HH, +8, GETDATE())
GROUP BY c.ParentServiceStationNameCN
) a
ORDER BY 4 DESC, 3 DESC  
```

## Top 10 服务站一次修复率(折线图）
```sql
SELECT  TOP 10 t2.ParentServiceStationNameCN ,
        ISNULL(t2.OneMoreTimeRepair, 0) OneMoreTimeRepair ,
        ISNULL(t2.ServiceTimes, 0) TotalRepaireTime ,
        ( CASE WHEN t2.ServiceTimes IS NOT NULL
                    AND t2.ServiceTimes > 0
               THEN 1 - ( CONVERT(DECIMAL, ISNULL(t2.OneMoreTimeRepair, 0))
                          / ISNULL(t2.ServiceTimes, 0) )
               ELSE 1
          END ) AS OnceRepairRatio
FROM     ( SELECT   c.ParentServiceStationNameCN,
					SUM(CASE WHEN a.ServiceContent LIKE N'%维修%' THEN a.OneMoreTimeRepair ELSE 0 END) OneMoreTimeRepair ,
					COUNT(*) ServiceTimes
			FROM    DW.viCareFieldServiceOrder a
				INNER JOIN DW.viCareServiceStation c ON a.ServiceProviderCompanyID = c.ServiceStationID
			WHERE   a.FiedServiceOrderStatus NOT IN ( N'已拒单', N'已取消' )
				AND a.CreatedDateTime BETWEEN DATEADD(YEAR, DATEDIFF(YEAR, 0, DATEADD(HH, +8, GETDATE())), 0)
				AND DATEADD(HH, +8, GETDATE())
			GROUP BY c.ParentServiceStationNameCN) t2
ORDER BY 4 ASC 
```


## 服务天数By服务团队(柱状图)
```sql
SELECT  b.ServiceTeam ,
        SUM(a.DaysInTimeSheet) DaysInTimeSheet
FROM    DW.viCareFieldServiceOrder a
        INNER JOIN DW.vABBFieldServiceEngineer b ON a.ServiceEngineerID = b.Userid
WHERE   a.FiedServiceOrderStatus NOT IN ( N'已拒绝', N'已取消' )
        AND a.CreatedDateTime >= DATEADD(YEAR, DATEDIFF(YEAR, 0, DATEADD(HH, +8, GETDATE())), 0)
        AND a.CreatedDateTime <= DATEADD(HH, +8, GETDATE())
GROUP BY b.ServiceTeam
ORDER BY 2 DESC
```

## Top10服务站拒单率(折线图)
```sql
SELECT  TOP 10 a.ParentServiceStationNameCN,
		SUM(ISNULL(RefuseCount, 0)) RefuseCount, 
		SUM(ISNULL(RefuseCount, 0)) + SUM(ISNULL(TotalCount, 0)) TotalCount,
		CASE WHEN SUM(ISNULL(TotalCount, 0)) = 0 THEN 0 
			ELSE CONVERT(DECIMAL, SUM(ISNULL(RefuseCount, 0)))/ (SUM(ISNULL(RefuseCount, 0)) + SUM(ISNULL(TotalCount, 0)))
		END RefuseRatio
FROM  DW.viCareServiceStation a
LEFT JOIN
(
	select a.ServiceStationID, 
		COUNT(a.FieldServiceOrderID) RefuseCount
	 from iCare.RefuseServiceRecord a
	INNER JOIN DW.viCareFieldServiceOrder c ON a.FieldServiceOrderID = c.FieldServiceOrderID
	WHERE a.FieldServiceOrderTypeL2 = 'S2' AND a.DispatchRequirement = N'申请跨区服务'
	AND c.FiedServiceOrderStatus != N'已取消' 
	GROUP BY a.ServiceStationID
) b ON a.ServiceStationID = b.ServiceStationID
LEFT JOIN (
	select a.ServiceProviderCompanyID, COUNT(*) TotalCount 
	FROM DW.viCareFieldServiceOrder a
	WHERE a.FiedServiceOrderStatus NOT IN  ( N'已拒单', N'已取消' )
	AND a.CreatedDateTime BETWEEN  DATEADD(YEAR, DATEDIFF(YEAR, 0, DATEADD(HH, +8, GETDATE())), 0)
        AND DATEADD(HH, +8, GETDATE())
	GROUP BY a.ServiceProviderCompanyID
) c ON a.ServiceStationID = c.ServiceProviderCompanyID
GROUP BY a.ParentServiceStationNameCN
ORDER BY 4 DESC
```

## 
```sql
SELECT (SELECT COUNT(*) FROM DW.vABBFieldServiceEngineer ) 
+ (select COUNT(DISTINCT EngineerID) from DW.vEngineerProductAuthorization) AS EngineerCount
```