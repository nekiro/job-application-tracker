import CompanyDTO from './CompanyDTO';

type JobDTO = {
  name: string;
  company: string | CompanyDTO;
  index: number;
  url: string;
};

export default JobDTO;
