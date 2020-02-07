SELECT
    DATE,
    total_sale_by_day,
    flag
FROM ( SELECT
    src.DATE,
 src.total_sale_by_day,
 CASE
     WHEN src.total_sale_by_day >= q3 + iqr THEN 1
     WHEN src.total_sale_by_day <= q1 - iqr THEN 0
     ELSE - 1
 END AS flag
FROM
    (
        SELECT
            DATE,
            CAST(SUM(sale_dollars) AS double) total_sale_by_day
        FROM
            yearly_sales
        GROUP BY
            DATE
    ) src,
    (
        SELECT
            percentile_approx(total_sale_by_day, 0.25) q1,
            percentile_approx(total_sale_by_day, 0.75) q3,
            1.5 * ( percentile_approx(total_sale_by_day, 0.75) - percentile_approx(total_sale_by_day, 0.25) ) iqr
        FROM
            (
                SELECT
                    DATE,
                    CAST(SUM(sale_dollars) AS double) total_sale_by_day
                FROM
                    yearly_sales
                GROUP BY
                    DATE
            ) a
    ) iq
WHERE
    1 = 1
) a WHERE flag >= 0;
