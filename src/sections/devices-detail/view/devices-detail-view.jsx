import React, {  useState } from 'react';
import { useParams } from 'react-router-dom';

import { Container,Stack, Grid,  Button, Box, Card, CardContent, Skeleton, CardActions } from '@mui/material';
import FilialCard from '../filial-card';
import DeviceCard from '../device-card';
import ExcelDownload from 'src/utils/excel-download';
import DateRangePickerComponent from 'src/utils/date-range-picker';
import AnimatedComponent from 'src/components/animate/animatedComponent';
import formatDatePicker from 'src/utils/format-date-picker';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import axiosInstance from 'src/routes/axios-config';
import { useQueries, useQuery } from '@tanstack/react-query';
const DevicesDetailView = () => {
   const [isdatePicker, setIsDatePicker] = useState(false);
   const [range, setRange] = useState({
     after: formatDatePicker(new Date()),
     before: formatDatePicker(new Date()),
   });
  const { id } = useParams();
  
  
  
  
  const { data: devicesCompany, isLoading: isLoadingCompany, } = useQuery({
    queryKey: ['filialDetails', id],
    queryFn:() => axiosInstance.get(`/merchant/devices/?company=${id}`).then((res) => res.data),
  })
  console.log(devicesCompany, 'devicesCompany');
 
  const {data: filial, isLoading: isLoadingFilial} = useQuery({
    queryKey: ['filialDetails', id, range],
    queryFn: async () => axiosInstance.get(`/merchant/financing/filial=${id}/?after=${range?.after}&before=${range.before}`).then((res) => res.data),
  })
  
  const queries = useQueries({
    queries: devicesCompany?.map((devices) => ({
      queryKey: ['devices', devices.id, range],
      queryFn: () => axiosInstance.get(`/merchant/financing/device=${devices.id}/?after=${range?.after}&before=${range.before}`).then((res) => res.data),
    })) || [],
  })
  const device = queries?.map((query) => query.data)
  const isLoadingDevice = queries?.some((query) => query.isLoading)

 const formattedData = device?.map((item) => {
  return {
    ID: item?.id,
    Nomi: item?.name,
    'Click ID': item?.code,
    'Sim kartasi': item?.phone_number,
    "Naqd to'lovlar miqdori": item?.cash?.amount,
    "Naqd to'lovlar soni": item?.cash?.count,
    "Onlayn to'lovlar miqdori": item?.click?.amount,
    "Onlayn to'lovlar soni": item?.click?.count,
    'Admin tolovlar miqdori': item?.manual?.amount ? item?.manual?.amount : 0,
    'Admin tolovlar soni': item?.manual?.count ? item?.manual?.count : 0,
  };})
 console.log(device)

  return (
    <Container>
      <Stack mb={5} direction="row" alignItems="center" justifyContent="end" spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Button
            onClick={() => setIsDatePicker(true)}
            variant="contained"
            sx={{ fontSize: { xs: '8px', sm: '14px' } }}
            startIcon={<CalendarMonthIcon />}
          >
            Sana oralig'i
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <ExcelDownload title="DeviceDetails" formattedData={formattedData} />
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        {isdatePicker ? (
          <DateRangePickerComponent
            setIsDatePicker={setIsDatePicker}
            setRange={(a) => {
              // setDevice([]);
              setRange(a);
            }}
          />
        ) : null}
      </Stack>
      <Grid container spacing={5}>
        <Grid item="true" xs={12} sm={6} md={4}>
          <AnimatedComponent>
            <FilialCard filial={filial} isLoading={isLoadingFilial} />
          </AnimatedComponent>
        </Grid>

        {isLoadingDevice
          ? Array(5)
              .fill(0)
              .map(() => (
                <Grid sx={{ width: '100%' }} item xs={12} sm={6} md={4}>
                  <Box sx={{ minWidth: 275 }}>
                    <Card
                      variant="outlined"
                      sx={{
                        maxHeight: '265px',
                        minWidth: '275px',
                        marginBottom: '20px',
                        marginLeft: '20px',
                      }}
                    >
                      <CardContent sx={{ lineHeight: '20px' }}>
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="70%" />
                        <Skeleton variant="text" width="60%" />
                      </CardContent>
                      <CardActions>
                        <Skeleton variant="text" width="100%" />
                      </CardActions>
                    </Card>
                  </Box>
                </Grid>
              ))
          : device?.map((item) => (
              <Grid
                item
                sx={{ width: '100%', maxHeight: '265px', mb: 5 }}
                key={item.id}
                xs={12}
                sm={6}
                md={4}
              >
                <AnimatedComponent>
                  <DeviceCard
                    id={item.id}
                    name={item.name}
                    cash={item.cash}
                    click={item.click}
                    devices_count={item.devices_count}
                    manual={item.manual}
                    code={item.code}
                  />
                </AnimatedComponent>
              </Grid>
            ))}
      </Grid>
    </Container>
  );
};

export default DevicesDetailView;
