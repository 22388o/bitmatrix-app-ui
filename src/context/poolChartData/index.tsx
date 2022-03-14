import { BmChart } from '@bitmatrix/models';
import { ComponentProps, createContext, FC, useContext, useReducer } from 'react';
import { setPoolChartDataAction } from './actions';
import { poolChartDataReducer } from './reducer';
import { IPoolChartDataContext } from './types';

type Props = {
  children: React.ReactNode;
};

const PoolChartDataContext = createContext<IPoolChartDataContext>({} as IPoolChartDataContext);

export const usePoolChartDataContext = (): IPoolChartDataContext => useContext(PoolChartDataContext);

export const PoolChartDataContextProvider: React.FC<Props> = ({ children }: ComponentProps<FC>): JSX.Element => {
  const [poolChartDataContext, dispatch] = useReducer(poolChartDataReducer, []);

  const setPoolChartData = (chart_data: BmChart[]): void => {
    setPoolChartDataAction(chart_data, dispatch);
  };

  return (
    <PoolChartDataContext.Provider value={{ poolChartDataContext, setPoolChartData }}>
      {children}
    </PoolChartDataContext.Provider>
  );
};
