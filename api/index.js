require('dotenv').config(); // тобы считывать инфу из файла .env
const express = require('express');
const cors = require('cors');
const db = require('./db');


const port = process.env.PORT || 5000;

const app = express();


// внутри мидалвара можно отправить запрос на статус фэйл юзеру
// app.use((req, res, next) => {
//   console.log('middlware');
//   next();
// })
app.use(cors());
app.use(express.json()); //чтобы приложение парсило json формат


app.get('/api', async (req, res) => {

  try {
    const results = await db.query(`
    select distinct journalized_id                                              as taskNumber,
                t.name                                                          as tracker,
                i_i.subject                                                     as theme,
                i_s.name                                                        as status,
                ens.name                                                        as priority,
                sum(hours) over (partition by i_i.id)                           as labour,
                i_i.created_on                                                  as createDate,
                i_i.updated_on                                                  as updatedate,
                i_i.closed_on                                                   as closedDate,
                round(extract(epoch from j_j.created_on - i_i.created_on) / 60) as createClosed,

                (select sum(inter.timest)
                 from (select round(extract(epoch from jj.created_on - lag(jjj.created_on) over (order by j.id)) /
                                    60) as timest
                       from journals j

                                left outer join journals jj on jj.id = j.id and jj.id in (

                           select jj.id
                           from journals jj
                                    join issues i on jj.journalized_id = i.id
                                    join journal_details jd on jj.id = jd.journal_id
                                    join users u on jj.user_id = u.id
                           where jj.journalized_id = j_j.journalized_id

                             and jd.prop_key not in ('assigned_to_id', 'done_ratio')
                             and value not in ('5')
                             and jj.private_notes = 'false'
                             and old_value != '1'
                             and jj.id not in (select max(j.id)
                                               from journals j
                                                        left join journal_details jd on j.id = jd.journal_id
                                               where journalized_id = j_j.journalized_id
                                                 and prop_key is not null
                                                 and prop_key not in ('assigned_to_id', 'done_ratio')
                                                 and value not in ('5')
                                                 and private_notes = 'false'
                                               group by j.journalized_id)
                             and old_value in ('3', '4')
                           order by jj.id
                       )

                                left outer join journals jjj on jjj.id = j.id and jjj.id in (

                           select jj.id
                           from journals jj
                                    join issues i on jj.journalized_id = i.id
                                    join journal_details jd on jj.id = jd.journal_id
                                    join users u on jj.user_id = u.id
                           where jj.journalized_id = j_j.journalized_id

                             and jd.prop_key not in ('assigned_to_id', 'done_ratio')
                             and value not in ('5')
                             and jj.private_notes = 'false'
                             and old_value != '1'
                             and jj.id not in (select max(j.id)
                                               from journals j
                                                        left join journal_details jd on j.id = jd.journal_id
                                               where journalized_id = j_j.journalized_id
                                                 and prop_key is not null
                                                 and prop_key not in ('assigned_to_id', 'done_ratio')
                                                 and value not in ('5')
                                                 and private_notes = 'false'
                                               group by j.journalized_id)
                             and old_value = '2'
                           order by jj.id
                       )

                                join issues i on j.journalized_id = i.id
                                join journal_details jd on j.id = jd.journal_id
                                join users u on j.user_id = u.id
                       where j.journalized_id = j_j.journalized_id

                         and jd.prop_key not in ('assigned_to_id', 'done_ratio')
                         and jd.value not in ('5')
                         and j.private_notes = 'false'
                         and jd.old_value != '1'
                         and j.id not in (select max(j.id)
                                          from journals j
                                                   left join journal_details jd on j.id = jd.journal_id
                                          where journalized_id = j_j.journalized_id
                                            and prop_key is not null
                                            and prop_key not in ('assigned_to_id', 'done_ratio')
                                            and value not in ('5')
                                            and private_notes = 'false'
                                          group by j.journalized_id)
                       order by j.id) as inter)                                 as Interv

from issues i_i
         join journals j_j on j_j.journalized_id = i_i.id
         join trackers t on i_i.tracker_id = t.id
         join issue_statuses i_s on i_i.status_id = i_s.id
         join enumerations ens on i_i.priority_id = ens.id
         left join time_entries te on i_i.id = te.issue_id
where i_i.project_id = 25
  and j_j.id in (select max(j.id)
                 from journals j
                          left join journal_details jd on j.id = jd.journal_id
                 where prop_key is not null
                   and prop_key not in ('assigned_to_id', 'done_ratio')
                   and value in ('3')
                   and private_notes = 'false'
                 group by j.journalized_id)

  and ((extract(epoch from i_i.created_on) < ${req.query.date1} and closed_on is null)
    or (extract(epoch from i_i.created_on) < ${req.query.date1} and extract(epoch from i_i.closed_on) between ${req.query.date1} and ${req.query.date2})
    or (extract(epoch from i_i.created_on) between ${req.query.date1} and ${req.query.date2}))

union distinct

select distinct journalized_id                                                  as taskNumber,
                t.name                                                          as tracker,
                i_i.subject                                                     as theme,
                i_s.name                                                        as status,
                ens.name                                                        as priority,
                sum(hours) over (partition by i_i.id)                           as labour,
                i_i.created_on                                                  as createDate,
                i_i.updated_on                                                  as updatedate,
                i_i.closed_on                                                   as closedDate,
                round(extract(epoch from j_j.created_on - i_i.created_on) / 60) as createClosed,
                0 as Interv
from issues i_i
         join journals j_j on j_j.journalized_id = i_i.id
         join trackers t on i_i.tracker_id = t.id
         join issue_statuses i_s on i_i.status_id = i_s.id
         join enumerations ens on i_i.priority_id = ens.id
         left join time_entries te on i_i.id = te.issue_id
where i_i.project_id = 25
  and j_j.id in (select max(j.id)
                 from journals j
                          left join journal_details jd on j.id = jd.journal_id
                 where prop_key is not null
                   and prop_key not in ('assigned_to_id', 'done_ratio')
                   and value in ('5')
                   and private_notes = 'false'
                 group by j.journalized_id)

 and ((extract(epoch from i_i.created_on) < ${req.query.date1} and closed_on is null)
    or (extract(epoch from i_i.created_on) < ${req.query.date1} and extract(epoch from i_i.closed_on) between ${req.query.date1} and ${req.query.date2})
    or (extract(epoch from i_i.created_on) between ${req.query.date1} and ${req.query.date2}))
and i_i.id not in (
select distinct journalized_id
from issues i_i
         join journals j_j on j_j.journalized_id = i_i.id
         join trackers t on i_i.tracker_id = t.id
         join issue_statuses i_s on i_i.status_id = i_s.id
         join enumerations ens on i_i.priority_id = ens.id
         left join time_entries te on i_i.id = te.issue_id
where i_i.project_id = 25
  and j_j.id in (select max(j.id)
                 from journals j
                          left join journal_details jd on j.id = jd.journal_id
                 where prop_key is not null
                   and prop_key not in ('assigned_to_id', 'done_ratio')
                   and value in ('3')
                   and private_notes = 'false'
                 group by j.journalized_id)
  and ((extract(epoch from i_i.created_on) < ${req.query.date1} and closed_on is null)
    or (extract(epoch from i_i.created_on) < ${req.query.date1} and extract(epoch from i_i.closed_on) between ${req.query.date1} and ${req.query.date2})
    or (extract(epoch from i_i.created_on) between ${req.query.date1} and ${req.query.date2})))
    `)
    res.status(200).json({
      results: results.rows.length,
      tasks: results.rows,
    })
  } catch (err) {
    console.log(err)
  }
  
})

app.listen(port, () => {
  console.log(`Server startes on port ${port}.`)
})






