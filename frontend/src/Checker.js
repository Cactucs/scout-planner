import DateUtils from './DateUtils.js'

async function checkRules(rules, programs) {
  return Object.fromEntries(
    Object.entries(rules).map(([id, rule]) => {
      const program = programs[rule.program];

      if (!program)
        return [id, { program: null, satisfied: false, msg: 'Program neexistuje' }];

      const success = () => [id, { program: program._id, satisfied: true, msg: null }];
      const failure = (msg) => [id, { program: program._id, satisfied: false, msg: msg }];

      if (rule.condition === 'is_before_date')
        return (program.begin + program.duration <= rule.value) ? success() :
          failure(`Program by měl skončit nejpozději v ${DateUtils.formatDateTime(rule.value)}`);

      if (rule.condition === 'is_after_date')
        return (program.begin >= rule.value) ? success() :
          failure(`Program by měl začínat nejdříve v ${DateUtils.formatDateTime(rule.value)}`);

      if (rule.condition === 'is_before_program' || rule.condition === 'is_after_program') {
        const program2 = programs[rule.value];

        if (!program2)
          return failure('Druhý program neexistuje');

        if (rule.condition === 'is_before_program')
          return (program.begin + program.duration <= program2.begin) ? success() :
            failure(`Program by měl proběhnout před programem ${program2.title})`);

        if (rule.condition === 'is_after_program')
          return (program.begin >= program2.begin + program2.duration) ? success() :
            failure(`Program by měl proběhnout po programu ${program2.title})`);
      }

      return failure('Neznámé pravidlo');
    })
  );
}

export default {checkRules};