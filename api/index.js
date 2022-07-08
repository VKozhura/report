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
  console.log(req.query.date1)
  console.log(req.query.date2)
  try {
    const results = await db.query(`select distinct journalized_id  as taskNumber,
    t.name                                                          as tracker,
    i_i.subject                                                     as theme,
    i_s.name                                                        as status,
    ens.name                                                        as priority,
    sum(hours) over (partition by i_i.id)                           as labour,
    i_i.created_on                                                  as createDate,
    i_i.updated_on                                                  as updatedate,
    i_i.closed_on                                                   as closedDate,
    round(extract(epoch from j_j.created_on - i_i.created_on) / 60) as createClosed
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

and (( extract(epoch from i_i.created_on) < ${req.query.date1} and closed_on is null) 
or (extract(epoch from i_i.created_on) < ${req.query.date1} and extract(epoch from i_i.closed_on) between ${req.query.date1} and ${req.query.date2}) 
or (extract(epoch from i_i.created_on) between ${req.query.date1} and ${req.query.date2})) 
and i_i.id not in (
         80768,
         80783,
         80842,
         80884,
         80887,
         80894,
         80906,
         80917,
         80918,
         80932,
         80950,
         80957,
         80959,
         80966,
         80970,
         80974,
         80976,
         80980,
         80981,
         80982,
         80987,
         80991,
         80995,
         80996,
         81006,
         81007,
         81017,
         81018,
         81019,
         81020,
         81039,
         81040,
         81044,
         81045,
         81046,
         81048,
         81066,
         81067,
         81071,
         81072,
         81073,
         81075,
         81081,
         81084,
         81086,
         81093,
         81100,
         81104,
         81112,
         81122,
         81129,
         81131,
         81139,
         81141,
         81144,
         81148,
         81150,
         81155,
         81160,
         81162,
         81163,
         81164,
         81165,
         81166,
         81167,
         81168,
         81169,
         81170,
         81174,
         81175,
         81176,
         81177,
         81178,
         81180,
         81182,
         81183,
         81185,
         81187,
         81192,
         81193,
         81194,
         81196,
         81199,
         81200,
         81203,
         81208,
         81209,
         81210,
         81211,
         81212,
         81213,
         81215,
         81216,
         81217,
         81218,
         81220,
         81223,
         81228,
         81231,
         81233,
         81235,
         81237,
         81243,
         81246,
         81250,
         81252,
         81254,
         81258,
         81266,
         81285,
         81289,
         81297,
         81298,
         81301
)
order by journalized_id;
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






