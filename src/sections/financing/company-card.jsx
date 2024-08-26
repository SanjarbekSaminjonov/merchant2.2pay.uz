import { Box, Typography, Card, CardContent, Skeleton } from '@mui/material';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'src/routes/axios-config';

const CompanyCard = ({ range }) => {
  const { after, before } = range;

  const { data, error, isLoading } = useQuery({
    queryKey: ['company'],
    queryFn: () => axiosInstance.get('/users/request-user/').then((res) => res.data),
  });

  const {
    data: companyDetail,
    error: companyDetailError,
    isLoading: companyDetailLoading,
  } = useQuery({
    queryKey: ['companyDetail'],
    queryFn: () =>
      axiosInstance
        .get(`/merchant/financing/company-detail/?after=${after}&before=${before}`)
        .then((res) => res.data),
    onError: (error) => {
      console.log(error);
    },
  });

  if (error || companyDetailError) return 'An error has occurred: ' + error;

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card sx={{ minWidth: 275, backgroundColor: '#b9f6ca', maxHeight: 265 }} variant="outlined">
        <CardContent sx={{ lineHeight: '20px' }}>
          {isLoading || companyDetailLoading ? (
            <>
              <Skeleton
                variant="text"
                height={30}
                sx={{ fontSize: '1.5rem', textAlign: 'center' }}
              />
              <Skeleton variant="text" height={25} sx={{ mt: 1 }} />
              <Skeleton variant="text" height={25} sx={{ mt: 1 }} />
              <Skeleton variant="text" height={25} sx={{ mt: 1 }} />
              <Skeleton variant="text" height={25} sx={{ mt: 1 }} />
              <Skeleton variant="text" height={25} sx={{ mt: 1 }} />
            </>
          ) : (
            <>
              <Typography
                variant="h5"
                sx={{ fontSize: 14, textAlign: 'center' }}
                color="text.secondary"
                gutterBottom
              >
                {data?.current_company?.name}
              </Typography>
              <Typography color={'text.primary'} variant="subtitle1" component="div">
                Qurilmalar:{' '}
                <Box
                  component={'span'}
                  sx={{ fontWeight: 'fontWeightBold', color: 'text.secondary' }}
                >
                  {' '}
                  {data?.current_company?.devices_count} ta
                </Box>
              </Typography>
              <Typography color={'text.primary'} variant="subtitle1" component="div">
                Filiallar:{' '}
                <Box
                  component={'span'}
                  sx={{ fontWeight: 'fontWeightBold', color: 'text.secondary' }}
                >
                  {' '}
                  {data?.current_company?.filials_count} ta
                </Box>
              </Typography>
              <Typography color={'text.primary'} variant="subtitle1" component="div">
                Naqd pul to'lovlari:{' '}
                <Box
                  component={'span'}
                  sx={{ fontWeight: 'fontWeightBold', color: 'text.secondary' }}
                >
                  {' '}
                  {companyDetail?.cash?.amount} so'm <br /> ({companyDetail?.cash?.count} ta
                  transaksiya)
                </Box>
              </Typography>
              <Typography color="text.primary" variant="subtitle1" component="div">
                Onlayn to'lovlar:{' '}
                <Box
                  component={'span'}
                  sx={{ fontWeight: 'fontWeightBold', color: 'text.secondary' }}
                >
                  {companyDetail?.click?.amount} so'm <br />({companyDetail?.click?.count} ta
                  transaksiya)
                </Box>
              </Typography>
              <Typography variant="subtitle1">
                Admin to'lovlari:{' '}
                <Box
                  component={'span'}
                  sx={{ fontWeight: 'fontWeightBold', color: 'text.secondary' }}
                >
                  {companyDetail?.manual?.amount === null ? 0 : companyDetail?.manual?.amount} so'm{' '}
                  <br />({companyDetail?.manual?.count} ta transaksiya)
                </Box>
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CompanyCard;
