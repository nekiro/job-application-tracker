import CompanyDTO from './CompanyDTO';

type JobDTO = {
  name: string;
  company: string | CompanyDTO;
};

export default JobDTO;
