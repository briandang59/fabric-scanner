"use client";

import FabricComparisonChart from "@/components/common/FabricComparisonChart";
import TopFabricsByCustomerList from "@/components/common/TopFabricsByCustomerList";
import TopFabricsChart from "@/components/common/TopFabricsChart";
import { useTranslationCustom } from "@/utils/hooks/useTranslationCustom";
import { Col, Row, Typography } from "antd";

const { Title } = Typography;

export const dynamic = "force-dynamic";

function StatisticalPage() {
  const { t } = useTranslationCustom();
  return (
    <div style={{ padding: "24px", background: "#f0f2f5" }}>
      <Title level={2} style={{ marginBottom: "24px" }}>
        {t.statistical.title}
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <TopFabricsChart />
        </Col>
        <Col xs={24} lg={12}>
          <TopFabricsByCustomerList />
        </Col>
        <Col xs={24}>
          <FabricComparisonChart />
        </Col>
      </Row>
    </div>
  );
}

export default StatisticalPage;
